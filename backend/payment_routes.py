"""
Stripe Payment Integration for Tanning Packages and Lotions
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
    # Tanning fields
    package_id: Optional[str] = None  # e.g., "level2_ten_pack"
    # Lotion fields
    lotion_id: Optional[str] = None
    quantity: Optional[int] = 1
    # Common fields
    customer_name: str
    customer_email: str
    customer_phone: str
    origin_url: str
    discount_code: Optional[str] = None  # applies to tanning only
    metadata: Optional[Dict] = None


def _sanitize(doc: Dict) -> Dict:
    d = dict(doc)
    d.pop('_id', None)
    return d

async def _validate_and_apply_discount(amount: float, code: Optional[str]) -> Dict[str, Optional[float]]:
    """Validate discount code; return dict with fields: final_amount, percent_off, code_status, code"""
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
    """Create Stripe checkout session for tanning package or lotion purchase"""
    is_lotion = payment_req.lotion_id is not None

    # Determine amount and build metadata
    metadata: Dict[str, str] = {}

    if is_lotion:
        # Lotion checkout
        lotion = await db.lotions.find_one({"id": payment_req.lotion_id, "active": True})
        if not lotion:
            raise HTTPException(status_code=400, detail="invalid_lotion_id")
        qty = max(1, int(payment_req.quantity or 1))
        amount = round(float(lotion.get("price", 0.0)) * qty, 2)
        level_name = lotion.get("name", "Lotion")
        metadata.update({
            "item_type": "lotion",
            "lotion_id": payment_req.lotion_id,
            "lotion_name": level_name,
            "quantity": str(qty)
        })
        final_amount = amount  # no discounts for lotions
    else:
        # Tanning package checkout
        all_packages = mary_well.get_tanning_packages()
        if not payment_req.package_id:
            raise HTTPException(status_code=400, detail="package_id_required")
        parts = payment_req.package_id.split('_', 1)
        if len(parts) != 2:
            raise HTTPException(status_code=400, detail="Invalid package_id format")
        level, package_type = parts
        if level not in all_packages or package_type not in all_packages[level]["packages"]:
            raise HTTPException(status_code=400, detail="Invalid package")
        amount = float(all_packages[level]["packages"][package_type])
        level_name = all_packages[level]["name"]
        disc_meta = await _validate_and_apply_discount(amount, payment_req.discount_code)
        final_amount = disc_meta["final_amount"]
        metadata.update({
            "item_type": "tanning",
            "package_id": payment_req.package_id,
            "level": level,
            "package_type": package_type,
            "level_name": level_name,
            "original_amount": str(amount),
            "final_amount": str(final_amount)
        })
        if disc_meta.get("code"):
            metadata.update({
                "discount_code": disc_meta["code"],
                "discount_percent": str(disc_meta["percent_off"])
            })

    # Create webhook URL
    host_url = payment_req.origin_url
    webhook_url = f"{host_url}/api/payments/webhook/stripe"

    # Initialize Stripe checkout
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    # Success/cancel URLs
    success_url = f"{payment_req.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{payment_req.origin_url}/payment/cancel"

    # Create checkout session
    checkout_request = CheckoutSessionRequest(
        amount=final_amount,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            **metadata,
            "customer_name": payment_req.customer_name,
            "customer_email": payment_req.customer_email,
            "customer_phone": payment_req.customer_phone,
        }
    )
    session = await stripe_checkout.create_checkout_session(checkout_request)

    # Persist tx
    tx_doc = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "customer_name": payment_req.customer_name,
        "customer_email": payment_req.customer_email,
        "customer_phone": payment_req.customer_phone,
        "amount": final_amount,
        "currency": "usd",
        "payment_status": "pending",
        "status": "initiated",
        "metadata": checkout_request.metadata,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    if is_lotion:
        tx_doc.update({
            "lotion_id": payment_req.lotion_id,
            "quantity": int(payment_req.quantity or 1)
        })
    else:
        tx_doc.update({
            "package_id": payment_req.package_id,
            "discount_code": metadata.get("discount_code"),
            "discount_percent": int(metadata.get("discount_percent")) if metadata.get("discount_percent") else None
        })
    await db.payment_transactions.insert_one(tx_doc)

    return session


@router.get("/checkout/status/{session_id}", response_model=CheckoutStatusResponse)
async def get_checkout_status(session_id: str):
    # Same as before
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
    status = await stripe_checkout.get_checkout_status(session_id)

    existing = await db.payment_transactions.find_one({"session_id": session_id})
    if status.payment_status == "paid" and existing:
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"payment_status": "paid", "status": "completed", "paid_at": datetime.now(timezone.utc), "updated_at": datetime.now(timezone.utc)}}
        )
        # if tanning with discount, mark redeemed
        if existing.get("discount_code"):
            await db.discount_codes.update_one(
                {"code": existing["discount_code"]},
                {"$set": {"status": "redeemed", "redeemed_at": datetime.now(timezone.utc)}}
            )
    return status


@router.post("/webhook/stripe")
async def handle_stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature", "")
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
    webhook_response = await stripe_checkout.handle_webhook(body, signature)
    if webhook_response.event_type == "checkout.session.completed":
        await db.payment_transactions.update_one(
            {"session_id": webhook_response.session_id},
            {"$set": {"payment_status": webhook_response.payment_status, "status": "completed", "webhook_received_at": datetime.now(timezone.utc), "updated_at": datetime.now(timezone.utc)}}
        )
        tx = await db.payment_transactions.find_one({"session_id": webhook_response.session_id})
        if tx and tx.get("discount_code") and webhook_response.payment_status == "paid":
            await db.discount_codes.update_one(
                {"code": tx["discount_code"]},
                {"$set": {"status": "redeemed", "redeemed_at": datetime.now(timezone.utc)}}
            )
    return {"status": "success"}
