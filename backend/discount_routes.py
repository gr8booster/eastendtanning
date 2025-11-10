"""
Discount Codes API
- Generate, validate, list, invalidate discount codes (5%, 10%, 15%)
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta, timezone
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import random
import string

router = APIRouter(prefix="/api/discounts", tags=["discounts"])

# MongoDB
mongo_url = os.environ.get("MONGO_URL")
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get("DB_NAME", "test_database")]


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


class GenerateRequest(BaseModel):
    percent_off: int
    session_id: Optional[str] = None
    expires_in_days: Optional[int] = 7


class GenerateResponse(BaseModel):
    id: str
    code: str
    percent_off: int
    status: str
    expires_at: datetime
    created_at: datetime


class ValidateResponse(BaseModel):
    valid: bool
    reason: Optional[str] = None
    discount: Optional[DiscountCode] = None


ALLOWED_DISCOUNTS = {5, 10, 15}
CODE_PREFIX = os.environ.get("DISCOUNT_CODE_PREFIX", "EASTEND")


def _make_code(percent: int) -> str:
    # Example: EASTEND-15-AB7KQ9
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"{CODE_PREFIX}-{percent}-{suffix}"


def _sanitize(doc: Dict[str, Any]) -> Dict[str, Any]:
    if not doc:
        return doc
    d = dict(doc)
    d.pop("_id", None)
    return d


@router.post("/generate", response_model=GenerateResponse)
async def generate_discount(req: GenerateRequest):
    if req.percent_off not in ALLOWED_DISCOUNTS:
        raise HTTPException(status_code=400, detail="percent_off must be one of 5, 10, 15")

    # Expiry
    days = req.expires_in_days if req.expires_in_days and req.expires_in_days > 0 else 7
    expires_at = datetime.now(timezone.utc) + timedelta(days=days)

    # Generate code and persist
    code = _make_code(req.percent_off)
    doc = DiscountCode(
        code=code,
        percent_off=req.percent_off,
        expires_at=expires_at,
        created_by=req.session_id or "system"
    ).model_dump()

    await db.discount_codes.insert_one(doc)

    return GenerateResponse(
        id=doc["id"],
        code=doc["code"],
        percent_off=doc["percent_off"],
        status=doc["status"],
        expires_at=doc["expires_at"],
        created_at=doc["created_at"],
    )


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
async def generate_first_time_discount():
    """Generate a first-time visitor discount code (15% off, 7-day expiry)"""
    code = _make_code(15)
    
    discount_data = {
        "id": str(uuid.uuid4()),
        "code": code,
        "percent_off": 15,
        "status": "active",
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc),
        "created_by": "first_time_system",
        "notes": "First-time visitor discount"
    }
    
    await db.discount_codes.insert_one(discount_data)
    
    return {
        "code": code,
        "percent_off": 15,
        "expires_at": discount_data["expires_at"].isoformat()
    }
