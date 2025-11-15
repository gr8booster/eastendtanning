"""Customer Profile and Memory System
Stores customer information, consultation history, and preferences
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
import os

router = APIRouter(prefix="/api/customers", tags=["customers"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

class CustomerProfile(BaseModel):
    customer_id: str
    name: str
    phone: str
    email: Optional[str] = None
    skin_type: Optional[str] = None  # fair, medium, olive, darker
    tanning_reason: Optional[str] = None  # vacation, wedding, etc
    recommended_bed_level: Optional[str] = None
    recommended_package: Optional[str] = None
    consultation_history: List[Dict[str, Any]] = []
    purchase_history: List[Dict[str, Any]] = []
    preferences: Dict[str, Any] = {}
    created_at: datetime
    last_consultation: Optional[datetime] = None
    total_consultations: int = 0

class CreateCustomerProfile(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    session_id: Optional[str] = None

class UpdateCustomerProfile(BaseModel):
    skin_type: Optional[str] = None
    tanning_reason: Optional[str] = None
    recommended_bed_level: Optional[str] = None
    recommended_package: Optional[str] = None
    email: Optional[str] = None

@router.post("/create", response_model=Dict)
async def create_customer_profile(data: CreateCustomerProfile):
    """Create or retrieve customer profile by phone number"""
    # Check if customer exists by phone
    existing = await db.customer_profiles.find_one({"phone": data.phone})
    
    if existing:
        # Customer exists - return existing profile
        existing.pop('_id', None)
        return {
            "customer_id": existing["customer_id"],
            "existing": True,
            "profile": existing
        }
    
    # Create new customer profile
    customer_id = str(uuid.uuid4())
    profile = {
        "customer_id": customer_id,
        "name": data.name,
        "phone": data.phone,
        "email": data.email,
        "skin_type": None,
        "tanning_reason": None,
        "recommended_bed_level": None,
        "recommended_package": None,
        "consultation_history": [],
        "purchase_history": [],
        "preferences": {},
        "created_at": datetime.now(timezone.utc),
        "last_consultation": None,
        "total_consultations": 0
    }
    
    # Link to session if provided
    if data.session_id:
        profile["last_session_id"] = data.session_id
        await db.chat_sessions.update_one(
            {"session_id": data.session_id},
            {"$set": {"customer_id": customer_id}}
        )
    
    await db.customer_profiles.insert_one(profile)
    profile.pop('_id', None)
    
    return {
        "customer_id": customer_id,
        "existing": False,
        "profile": profile
    }

@router.get("/by-phone/{phone}")
async def get_customer_by_phone(phone: str):
    """Retrieve customer profile by phone number"""
    profile = await db.customer_profiles.find_one({"phone": phone})
    
    if not profile:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    profile.pop('_id', None)
    return profile

@router.get("/{customer_id}")
async def get_customer_profile(customer_id: str):
    """Retrieve customer profile by ID"""
    profile = await db.customer_profiles.find_one({"customer_id": customer_id})
    
    if not profile:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    profile.pop('_id', None)
    return profile

@router.patch("/{customer_id}")
async def update_customer_profile(customer_id: str, updates: UpdateCustomerProfile):
    """Update customer profile with consultation data"""
    update_data = {k: v for k, v in updates.model_dump(exclude_none=True).items()}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No updates provided")
    
    update_data["last_consultation"] = datetime.now(timezone.utc)
    
    result = await db.customer_profiles.update_one(
        {"customer_id": customer_id},
        {
            "$set": update_data,
            "$inc": {"total_consultations": 1}
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Return updated profile
    profile = await db.customer_profiles.find_one({"customer_id": customer_id})
    profile.pop('_id', None)
    return profile

@router.post("/{customer_id}/consultation")
async def add_consultation_history(customer_id: str, consultation: Dict[str, Any]):
    """Add consultation to customer history"""
    consultation["timestamp"] = datetime.now(timezone.utc)
    
    result = await db.customer_profiles.update_one(
        {"customer_id": customer_id},
        {"$push": {"consultation_history": consultation}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    return {"message": "Consultation added to history"}

@router.post("/{customer_id}/purchase")
async def add_purchase_history(customer_id: str, purchase: Dict[str, Any]):
    """Add purchase to customer history"""
    purchase["timestamp"] = datetime.now(timezone.utc)
    
    result = await db.customer_profiles.update_one(
        {"customer_id": customer_id},
        {"$push": {"purchase_history": purchase}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    return {"message": "Purchase added to history"}
