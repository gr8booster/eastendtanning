"""
Stripe Payment Integration for Tanning Packages
"""
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime, timezone
import uuid
import os
from dotenv import load_dotenv

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, 
    CheckoutSessionResponse, 
    CheckoutStatusResponse, 
    CheckoutSessionRequest
)
from mary_well import mary_well
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

router = APIRouter(prefix="/api/payments", tags=["payments"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# Stripe configuration
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')

class PaymentRequest(BaseModel):
    package_id: str  # e.g., "level2_ten_pack"
    customer_name: str
    customer_email: str
    customer_phone: str
    origin_url: str
    discount_code: Optional[str] = None
    metadata: Optional[Dict] = None


def _sanitize(doc: Dict) -> Dict:
    d = dict(doc)
    d.pop('_id', None)
    return d

async def _validate_and_apply_discount(amount: float, code: Optional[str]) -> Dict[str, Optional[float]]:
    """Validate discount code; return dict with fields: final_amount, percent_off, code_status, code
    """
    if not code:
        return {"final_amount": amount, "percent_off": None, "code_status": None, "code": None}

    disc = await db.discount_codes.find_one({"code": code})
    if not disc:
        raise HTTPException(status_code=400, detail="invalid_discount_code")

    # Expiration check
    now = datetime.now(timezone.utc)
    status = disc.get("status", "active")
    expires_at = disc.get("expires_at")

    if status == "active" and isinstance(expires_at, datetime):
        # Ensure expires_at is timezone-aware for comparison
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < now:
            # Mark expired
            await db.discount_codes.update_one({"code": code}, {"$set": {"status": "expired"}})
            status = "expired"

    if status != "active":
        raise HTTPException(status_code=400, detail=f"discount_code_{status}")

    percent_off = int(disc.get("percent_off", 0))
    if percent_off not in {5, 10, 15}:
        raise HTTPException(status_code=400, detail="unsupported_discount_percent")

    final_amount = round(amount * (1 - percent_off / 100.0), 2)
    return {"final_amount": final_amount, "percent_off": percent_off, "code_status": status, "code": code}


@router.post("/checkout/session", response_model=CheckoutSessionResponse)
async def create_checkout_session(request: Request, payment_req: PaymentRequest):
    """Create Stripe checkout session for tanning package purchase"""
    # Get package details from Mary Well
    all_packages = mary_well.get_tanning_packages()

    # Parse package_id (format: "level2_ten_pack")
    parts = payment_req.package_id.split('_', 1)
    if len(parts) != 2:
        raise HTTPException(status_code=400, detail="Invalid package_id format")

    level = parts[0]
    package_type = parts[1]

    if level not in all_packages:
        raise HTTPException(status_code=400, detail=f"Invalid tanning level: {level}")

    if package_type not in all_packages[level]["packages"]:
        raise HTTPException(status_code=400, detail=f"Invalid package type: {package_type}")

    # Get base amount from server-side definition
    amount = float(all_packages[level]["packages"][package_type])
    level_name = all_packages[level]["name"]

    # Validate discount (if provided)
    discount_meta = await _validate_and_apply_discount(amount, payment_req.discount_code)
    final_amount = discount_meta["final_amount"]

    # Create webhook URL
    host_url = payment_req.origin_url
    webhook_url = f"{host_url}/api/payments/webhook/stripe"

    # Initialize Stripe checkout
    stripe_checkout = StripeCheckout(
        api_key=STRIPE_API_KEY,
        webhook_url=webhook_url
    )

    # Build success and cancel URLs
    success_url = f"{payment_req.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{payment_req.origin_url}/payment/cancel"

    # Prepare metadata (all values must be strings for Stripe)
    metadata = {
        "customer_name": payment_req.customer_name,
        "customer_email": payment_req.customer_email,
        "customer_phone": payment_req.customer_phone,
        "package_id": payment_req.package_id,
        "level": level,
        "package_type": package_type,
        "level_name": level_name,
        "original_amount": str(amount),
        "final_amount": str(final_amount),
    }
    if payment_req.metadata:
        metadata.update(payment_req.metadata)
    if discount_meta.get("code"):
        metadata.update({
            "discount_code": discount_meta["code"],
            "discount_percent": str(discount_meta["percent_off"]),
        })

    # Create checkout session
    checkout_request = CheckoutSessionRequest(
        amount=final_amount,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata
    )

    session = await stripe_checkout.create_checkout_session(checkout_request)

    # Store transaction in database
    await db.payment_transactions.insert_one({
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "customer_name": payment_req.customer_name,
        "customer_email": payment_req.customer_email,
        "customer_phone": payment_req.customer_phone,
        "package_id": payment_req.package_id,
        "level": level,
        "package_type": package_type,
        "amount": final_amount,
        "original_amount": amount,
        "currency": "usd",
        "payment_status": "pending",
        "status": "initiated",
        "metadata": metadata,
        "discount_code": discount_meta.get("code"),
        "discount_percent": discount_meta.get("percent_off"),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    })

    return session


@router.get("/checkout/status/{session_id}", response_model=CheckoutStatusResponse)
async def get_checkout_status(session_id: str):
    """Get status of a checkout session"""

    # Check if we've already processed this payment
    existing = await db.payment_transactions.find_one({"session_id": session_id})
    if existing and existing.get("payment_status") == "paid":
        # Already processed, return cached status
        return CheckoutStatusResponse(
            status="complete",
            payment_status="paid",
            amount_total=int(existing["amount"] * 100),
            currency=existing["currency"],
            metadata=existing.get("metadata", {})
        )

    # Initialize Stripe checkout
    stripe_checkout = StripeCheckout(
        api_key=STRIPE_API_KEY,
        webhook_url=""  # Not needed for status check
    )

    # Get status from Stripe
    status = await stripe_checkout.get_checkout_status(session_id)

    # Update database if payment is complete
    if status.payment_status == "paid" and existing:
        result = await db.payment_transactions.update_one(
            {
                "session_id": session_id,
                "payment_status": {"$ne": "paid"}  # Only update if not already paid
            },
            {
                "$set": {
                    "payment_status": "paid",
                    "status": "completed",
                    "paid_at": datetime.now(timezone.utc),
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )

        # If updated, mark discount code as redeemed
        if result.modified_count > 0:
            if existing.get("discount_code"):
                await db.discount_codes.update_one(
                    {"code": existing["discount_code"]},
                    {"$set": {"status": "redeemed", "redeemed_at": datetime.now(timezone.utc)}}
                )

    return status


@router.post("/webhook/stripe")
async def handle_stripe_webhook(request: Request):
    """Handle Stripe webhook events"""

    body = await request.body()
    signature = request.headers.get("Stripe-Signature", "")

    # Initialize Stripe checkout
    stripe_checkout = StripeCheckout(
        api_key=STRIPE_API_KEY,
        webhook_url=""  # Not needed for webhook handling
    )

    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)

        # Update database based on webhook event
        if webhook_response.event_type == "checkout.session.completed":
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {
                    "$set": {
                        "payment_status": webhook_response.payment_status,
                        "status": "completed" if webhook_response.payment_status == "paid" else "pending",
                        "webhook_received_at": datetime.now(timezone.utc),
                        "updated_at": datetime.now(timezone.utc)
                    }
                }
            )

            # If paid, mark discount code redeemed
            tx = await db.payment_transactions.find_one({"session_id": webhook_response.session_id})
            if tx and webhook_response.payment_status == "paid" and tx.get("discount_code"):
                await db.discount_codes.update_one(
                    {"code": tx["discount_code"]},
                    {"$set": {"status": "redeemed", "redeemed_at": datetime.now(timezone.utc)}}
                )

        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Utility endpoint for admin/testing: fetch a transaction by session_id
@router.get("/transaction/{session_id}")
async def get_transaction(session_id: str):
    tx = await db.payment_transactions.find_one({"session_id": session_id})
    if not tx:
        raise HTTPException(status_code=404, detail="transaction_not_found")
    return _sanitize(tx)
