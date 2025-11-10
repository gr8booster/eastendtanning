"""
Lotions Catalog API
- Staff can create/update lotions with pricing (JWT-protected)
- Public can list active lotions (no prices are hardcoded by AI/UI)
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
import os

from auth import verify_token
from roles import Permission, require_permission

router = APIRouter(prefix="/api/lotions", tags=["lotions"])

# Mongo
mongo_url = os.environ.get("MONGO_URL")
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get("DB_NAME", "test_database")]


class Lotion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    brand: Optional[str] = None
    price: float
    features: List[str] = Field(default_factory=list)
    tattoo_guard: bool = False
    image_url: Optional[str] = None
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LotionCreate(BaseModel):
    name: str
    brand: Optional[str] = None
    price: float
    features: List[str] = Field(default_factory=list)
    tattoo_guard: bool = False
    image_url: Optional[str] = None
    active: bool = True


class LotionUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = None
    features: Optional[List[str]] = None
    tattoo_guard: Optional[bool] = None
    image_url: Optional[str] = None
    active: Optional[bool] = None


def _clean(doc: Dict[str, Any]) -> Dict[str, Any]:
    d = dict(doc)
    d.pop("_id", None)
    return d


@router.get("", response_model=List[Lotion])
async def list_active_lotions(limit: int = Query(default=50, ge=1, le=200)):
    cursor = db.lotions.find({"active": True}).sort("created_at", -1).limit(limit)
    items: List[Lotion] = []
    async for doc in cursor:
        items.append(Lotion(**_clean(doc)))
    return items


@router.get("/admin/list", response_model=List[Lotion])
async def list_all_lotions(limit: int = Query(default=100, ge=1, le=500), payload: dict = Depends(verify_token)):
    cursor = db.lotions.find({}).sort("created_at", -1).limit(limit)
    items: List[Lotion] = []
    async for doc in cursor:
        items.append(Lotion(**_clean(doc)))
    return items


@router.post("", response_model=Lotion)
async def create_lotion(lotion: LotionCreate, payload: dict = Depends(verify_token)):
    item = Lotion(**lotion.model_dump())
    await db.lotions.insert_one(item.model_dump())
    return item


@router.patch("/{lotion_id}")
async def update_lotion(lotion_id: str, updates: LotionUpdate, payload: dict = Depends(verify_token)):
    data = {k: v for k, v in updates.model_dump(exclude_none=True).items()}
    if not data:
        raise HTTPException(status_code=400, detail="no_updates")
    data["updated_at"] = datetime.now(timezone.utc)
    result = await db.lotions.update_one({"id": lotion_id}, {"$set": data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="not_found")
    doc = await db.lotions.find_one({"id": lotion_id})
    return _clean(doc)
