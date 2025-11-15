"""
Discount Codes API
- Generate, validate, list, invalidate discount codes (5%, 10%, 15%)
- Auto-apply system with lead_id/session_id tracking
- Dynamic expiry: 15%=1day, 10%=3days, 5%=7days
"""
from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta, timezone
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import random
import string
from roles import Role, can_generate_discount
from auth import verify_token

router = APIRouter(prefix="/api/discounts", tags=["discounts"])

# MongoDB
mongo_url = os.environ.get("MONGO_URL")
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get("DB_NAME", "eastend_db")]


class DiscountCode(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    percent_off: int = Field(ge=1, le=100)
    status: str = Field(default="active")  # active, redeemed, expired, invalidated
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    redeemed_at: Optional[datetime] = None
    created_by: Optional[str] = None  # chat_session_id or admin
    notes: Optional[str] = None
    lead_id: Optional[str] = None  # Link to lead for auto-apply
    session_id: Optional[str] = None  # Link to session for auto-apply
    auto_applied: bool = False  # Whether this is auto-applied (no code shown)


class GenerateRequest(BaseModel):
    percent_off: int
    session_id: Optional[str] = None
    lead_id: Optional[str] = None
    expires_in_days: Optional[int] = None  # Auto-calculate if not provided
    auto_apply: bool = False  # If true, don't show code to user


class GenerateResponse(BaseModel):
    id: str
    code: Optional[str] = None  # Hidden if auto_applied
    percent_off: int
    status: str
    expires_at: datetime
    created_at: datetime
    message: str  # User-friendly message
    expires_in_hours: int  # Hours until expiry


class ValidateResponse(BaseModel):
    valid: bool
    reason: Optional[str] = None
    discount: Optional[DiscountCode] = None


class ActiveDiscountResponse(BaseModel):
    has_discount: bool
    discount: Optional[DiscountCode] = None
    percent_off: Optional[int] = None
    expires_at: Optional[datetime] = None
    expires_in_hours: Optional[int] = None


ALLOWED_DISCOUNTS = {5, 10, 15}
CODE_PREFIX = os.environ.get("DISCOUNT_CODE_PREFIX", "EASTEND")


def _make_code(percent: int) -> str:
    # Example: EASTEND-15-AB7KQ9
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"{CODE_PREFIX}-{percent}-{suffix}"


def _calculate_expiry_days(percent_off: int) -> int:
    """
    Calculate expiry days based on discount percentage:
    15% = 1 day
    10% = 3 days
    5% = 7 days
    """
    if percent_off == 15:
        return 1
    elif percent_off == 10:
        return 3
    else:  # 5% or other
        return 7


def _sanitize(doc: Dict[str, Any]) -> Dict[str, Any]:
    if not doc:
        return doc
    d = dict(doc)
    d.pop("_id", None)
    return d


@router.post("/generate", response_model=GenerateResponse)
async def generate_discount(req: GenerateRequest, current_user: dict = Depends(verify_token)):
    """Generate a discount code with auto-calculated expiry based on percentage"""
    if req.percent_off not in ALLOWED_DISCOUNTS:
        raise HTTPException(status_code=400, detail="percent_off must be one of 5, 10, 15")
    
    # Check role-based permission for discount generation
    user_role_str = current_user.get("role", "sales_associate")
    try:
        user_role = Role(user_role_str)
    except ValueError:
        user_role = Role.SALES
    
    if not can_generate_discount(user_role, req.percent_off):
        raise HTTPException(
            status_code=403,
            detail=f"Your role ({user_role.value}) cannot generate {req.percent_off}% discounts. Sales associates can only generate 5% discounts."
        )

    # Calculate expiry days based on percentage if not provided
    days = req.expires_in_days if req.expires_in_days and req.expires_in_days > 0 else _calculate_expiry_days(req.percent_off)
    expires_at = datetime.now(timezone.utc) + timedelta(days=days)
    hours_until_expiry = days * 24

    # Generate code and persist
    code = _make_code(req.percent_off)
    doc = DiscountCode(
        code=code,
        percent_off=req.percent_off,
        expires_at=expires_at,
        created_by=req.session_id or req.lead_id or "system",
        lead_id=req.lead_id,
        session_id=req.session_id,
        auto_applied=req.auto_apply
    ).model_dump()

    await db.discount_codes.insert_one(doc)

    # Create user-friendly message
    if req.auto_apply:
        if days == 1:
            message = f"✅ Your {req.percent_off}% discount has been automatically applied! It's valid for 24 hours."
        else:
            message = f"✅ Your {req.percent_off}% discount has been automatically applied! It's valid for {days} days."
    else:
        message = f"Your {req.percent_off}% discount code is ready! Valid for {days} days."

    return GenerateResponse(
        id=doc["id"],
        code=None if req.auto_apply else doc["code"],  # Hide code if auto-applied
        percent_off=doc["percent_off"],
        status=doc["status"],
        expires_at=doc["expires_at"],
        created_at=doc["created_at"],
        message=message,
        expires_in_hours=hours_until_expiry
    )


@router.get("/active", response_model=ActiveDiscountResponse)
async def get_active_discount(
    session_id: Optional[str] = Query(default=None),
    lead_id: Optional[str] = Query(default=None)
):
    """
    Check if there's an active discount for the given session_id or lead_id.
    Used for auto-applying discounts at checkout without user entering code.
    """
    if not session_id and not lead_id:
        return ActiveDiscountResponse(has_discount=False)
    
    # Build query
    query = {
        "status": "active",
        "$or": []
    }
    
    if session_id:
        query["$or"].append({"session_id": session_id})
    if lead_id:
        query["$or"].append({"lead_id": lead_id})
    
    # Find most recent active discount
    doc = await db.discount_codes.find_one(
        query,
        sort=[("created_at", -1)]  # Most recent first
    )
    
    if not doc:
        return ActiveDiscountResponse(has_discount=False)
    
    # Check if expired
    now = datetime.now(timezone.utc)
    expires_at = doc.get("expires_at")
    if isinstance(expires_at, datetime):
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        
        if expires_at < now:
            # Mark as expired
            await db.discount_codes.update_one(
                {"id": doc["id"]},
                {"$set": {"status": "expired"}}
            )
            return ActiveDiscountResponse(has_discount=False)
        
        # Calculate hours until expiry
        time_remaining = expires_at - now
        hours_remaining = int(time_remaining.total_seconds() / 3600)
    else:
        hours_remaining = 0
    
    discount = DiscountCode(**_sanitize(doc))
    
    return ActiveDiscountResponse(
        has_discount=True,
        discount=discount,
        percent_off=discount.percent_off,
        expires_at=discount.expires_at,
        expires_in_hours=hours_remaining
    )


@router.patch("/redeem/{discount_id}")
async def redeem_discount(discount_id: str):
    """
    Mark a discount as redeemed (called after successful payment).
    """
    result = await db.discount_codes.update_one(
        {"id": discount_id, "status": "active"},
        {
            "$set": {
                "status": "redeemed",
                "redeemed_at": datetime.now(timezone.utc)
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Discount not found or already redeemed")
    
    return {"status": "success", "message": "Discount redeemed"}


@router.get("/validate/{code}", response_model=ValidateResponse)
async def validate_discount(code: str):
    doc = await db.discount_codes.find_one({"code": code})
    if not doc:
        return ValidateResponse(valid=False, reason="not_found")

    # Normalize status if expired
    now = datetime.now(timezone.utc)
    expires_at = doc.get("expires_at")
    if doc.get("status") == "active" and isinstance(expires_at, datetime):
        # Ensure expires_at is timezone-aware for comparison
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < now:
            await db.discount_codes.update_one({"code": code}, {"$set": {"status": "expired"}})
            doc["status"] = "expired"

    if doc.get("status") != "active":
        return ValidateResponse(valid=False, reason=doc.get("status"), discount=DiscountCode(**_sanitize(doc)))

    return ValidateResponse(valid=True, discount=DiscountCode(**_sanitize(doc)))


@router.get("/list", response_model=List[DiscountCode])
async def list_discounts(status: Optional[str] = Query(default=None), limit: int = Query(default=50, ge=1, le=200)):
    query: Dict[str, Any] = {}
    if status and status != "all":
        query["status"] = status

    cursor = db.discount_codes.find(query).sort("created_at", -1).limit(limit)
    items: List[DiscountCode] = []
    async for doc in cursor:
        items.append(DiscountCode(**_sanitize(doc)))
    return items


@router.patch("/{code}/invalidate")
async def invalidate_discount(code: str):
    result = await db.discount_codes.update_one({"code": code}, {"$set": {"status": "invalidated"}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="code_not_found")
    return {"status": "success"}


@router.post("/first-time")
async def generate_first_time_discount(session_id: Optional[str] = None):
    """Generate a first-time visitor discount code (15% off, 1-day expiry, auto-applied)"""
    code = _make_code(15)
    
    discount_data = {
        "id": str(uuid.uuid4()),
        "code": code,
        "percent_off": 15,
        "status": "active",
        "expires_at": datetime.now(timezone.utc) + timedelta(days=1),  # 1 day for 15%
        "created_at": datetime.now(timezone.utc),
        "created_by": "first_time_system",
        "notes": "First-time visitor discount",
        "session_id": session_id,
        "auto_applied": True
    }
    
    await db.discount_codes.insert_one(discount_data)
    
    return {
        "id": discount_data["id"],
        "percent_off": 15,
        "expires_at": discount_data["expires_at"].isoformat(),
        "message": "🎁 15% discount automatically applied! Valid for 24 hours.",
        "expires_in_hours": 24
    }
