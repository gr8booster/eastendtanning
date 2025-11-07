"""
Marketing Journey API Routes
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime

from marketing_journey import journey_manager, JOURNEY_STAGES
from motor.motor_asyncio import AsyncIOMotorClient
import os

router = APIRouter(prefix="/api/journey", tags=["marketing_journey"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

class LeadCaptureRequest(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    service_interest: str = "tanning"
    chat_session_id: Optional[str] = None
    notes: Optional[str] = None

class EventTriggerRequest(BaseModel):
    lead_id: str
    event_type: str
    metadata: Optional[Dict] = None

@router.post("/capture-lead")
async def capture_lead(request: LeadCaptureRequest):
    """
    Capture lead and start marketing journey
    Called by Mary Well when customer provides contact info
    """
    if not request.email and not request.phone:
        raise HTTPException(
            status_code=400,
            detail="Either email or phone number is required"
        )
    
    lead_id = await journey_manager.capture_lead_from_chat({
        "name": request.name,
        "email": request.email,
        "phone": request.phone,
        "service_interest": request.service_interest,
        "chat_session_id": request.chat_session_id,
        "notes": request.notes
    })
    
    return {
        "status": "success",
        "lead_id": lead_id,
        "message": "Lead captured and marketing journey started"
    }

@router.post("/trigger-event")
async def trigger_event(request: EventTriggerRequest):
    """
    Trigger a journey event (e.g., purchase completed, session attended)
    """
    await journey_manager.trigger_event(
        request.lead_id,
        request.event_type,
        request.metadata
    )
    
    return {"status": "success", "message": "Event triggered"}

@router.get("/customer/{lead_id}")
async def get_customer_journey(lead_id: str):
    """
    Get customer's current journey status
    """
    journey = await journey_manager.get_customer_journey(lead_id)
    
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")
    
    return journey

@router.get("/stages")
async def get_journey_stages():
    """
    Get all available journey stages
    """
    return {"stages": JOURNEY_STAGES}

@router.get("/analytics")
async def get_journey_analytics():
    """
    Get marketing journey analytics
    """
    # Count customers in each stage
    pipeline = [
        {
            "$match": {"status": "active"}
        },
        {
            "$group": {
                "_id": "$current_stage",
                "count": {"$sum": 1}
            }
        }
    ]
    
    stage_counts = {}
    async for doc in db.marketing_journeys.aggregate(pipeline):
        stage_counts[doc["_id"]] = doc["count"]
    
    # Get total journeys
    total_journeys = await db.marketing_journeys.count_documents({"status": "active"})
    
    # Get scheduled actions
    pending_actions = await db.scheduled_marketing_actions.count_documents({
        "status": "scheduled"
    })
    
    completed_actions = await db.scheduled_marketing_actions.count_documents({
        "status": "completed"
    })
    
    return {
        "total_active_journeys": total_journeys,
        "stage_distribution": stage_counts,
        "pending_actions": pending_actions,
        "completed_actions": completed_actions
    }
