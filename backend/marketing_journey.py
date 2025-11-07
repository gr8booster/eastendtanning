"""
Marketing Journey & Automation System
Automatically captures leads and guides customers through marketing funnel
"""
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
import os

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# Marketing Journey Stages
JOURNEY_STAGES = {
    "awareness": {
        "name": "Awareness",
        "description": "Customer just discovered us",
        "next_stage": "interest",
        "actions": [
            {"type": "email", "delay_hours": 1, "template": "welcome"},
            {"type": "sms", "delay_hours": 24, "template": "first_visit_reminder"}
        ]
    },
    "interest": {
        "name": "Interest",
        "description": "Customer asking questions, exploring services",
        "next_stage": "consideration",
        "actions": [
            {"type": "email", "delay_hours": 2, "template": "service_details"},
            {"type": "sms", "delay_hours": 48, "template": "special_offer"}
        ]
    },
    "consideration": {
        "name": "Consideration",
        "description": "Customer completed skin type evaluation or viewed packages",
        "next_stage": "purchase",
        "actions": [
            {"type": "email", "delay_hours": 1, "template": "package_recommendations"},
            {"type": "sms", "delay_hours": 24, "template": "limited_time_offer"}
        ]
    },
    "purchase": {
        "name": "Purchase",
        "description": "Customer made first purchase",
        "next_stage": "onboarding",
        "actions": [
            {"type": "email", "delay_hours": 0, "template": "purchase_confirmation"},
            {"type": "sms", "delay_hours": 1, "template": "booking_reminder"}
        ]
    },
    "onboarding": {
        "name": "Onboarding",
        "description": "Customer had first session",
        "next_stage": "active",
        "actions": [
            {"type": "email", "delay_hours": 24, "template": "first_session_feedback"},
            {"type": "sms", "delay_hours": 72, "template": "tips_and_best_practices"}
        ]
    },
    "active": {
        "name": "Active",
        "description": "Regular customer with multiple visits",
        "next_stage": "loyal",
        "actions": [
            {"type": "email", "delay_hours": 168, "template": "weekly_specials"},
            {"type": "sms", "delay_hours": 336, "template": "loyalty_rewards"}
        ]
    },
    "loyal": {
        "name": "Loyal",
        "description": "VIP customer with consistent visits",
        "next_stage": "advocate",
        "actions": [
            {"type": "email", "delay_hours": 168, "template": "vip_exclusive_offers"},
            {"type": "sms", "delay_hours": 336, "template": "referral_program"}
        ]
    },
    "advocate": {
        "name": "Advocate",
        "description": "Customer refers others, leaves reviews",
        "next_stage": None,
        "actions": [
            {"type": "email", "delay_hours": 720, "template": "thank_you_rewards"}
        ]
    },
    "at_risk": {
        "name": "At Risk",
        "description": "Customer hasn't visited in 30+ days",
        "next_stage": "win_back",
        "actions": [
            {"type": "email", "delay_hours": 0, "template": "we_miss_you"},
            {"type": "sms", "delay_hours": 48, "template": "comeback_discount"}
        ]
    },
    "win_back": {
        "name": "Win Back",
        "description": "Attempting to re-engage inactive customer",
        "next_stage": "churned",
        "actions": [
            {"type": "email", "delay_hours": 0, "template": "final_offer"},
            {"type": "sms", "delay_hours": 72, "template": "last_chance"}
        ]
    },
    "churned": {
        "name": "Churned",
        "description": "Customer no longer active (60+ days)",
        "next_stage": None,
        "actions": []
    }
}

class MarketingJourneyManager:
    """Manages customer marketing journeys and automation"""
    
    async def capture_lead_from_chat(self, customer_data: Dict) -> str:
        """
        Capture lead from Mary Well chat interaction
        Automatically starts customer on marketing journey
        """
        lead_id = str(uuid.uuid4())
        
        # Check if lead already exists by email or phone
        existing_lead = await db.leads.find_one({
            "$or": [
                {"email": customer_data.get("email")},
                {"phone": customer_data.get("phone")}
            ]
        })
        
        if existing_lead:
            # Update existing lead
            await db.leads.update_one(
                {"id": existing_lead["id"]},
                {
                    "$set": {
                        "last_contact": datetime.now(timezone.utc),
                        "chat_session_id": customer_data.get("chat_session_id"),
                        "source": "mary_well_chat",
                        "updated_at": datetime.now(timezone.utc)
                    },
                    "$inc": {"interaction_count": 1}
                }
            )
            lead_id = existing_lead["id"]
        else:
            # Create new lead
            lead = {
                "id": lead_id,
                "name": customer_data.get("name", ""),
                "email": customer_data.get("email", ""),
                "phone": customer_data.get("phone", ""),
                "source": "mary_well_chat",
                "service_interest": customer_data.get("service_interest", "tanning"),
                "status": "new",
                "chat_session_id": customer_data.get("chat_session_id"),
                "interaction_count": 1,
                "notes": customer_data.get("notes", ""),
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
                "last_contact": datetime.now(timezone.utc)
            }
            await db.leads.insert_one(lead)
        
        # Start marketing journey
        await self.start_journey(lead_id, "awareness", {
            "source": "mary_well_chat",
            "service_interest": customer_data.get("service_interest", "tanning")
        })
        
        # Track conversion event
        await db.conversions.insert_one({
            "id": str(uuid.uuid4()),
            "session_id": customer_data.get("chat_session_id", "unknown"),
            "event_type": "lead_captured",
            "service": customer_data.get("service_interest", "tanning"),
            "source": "mary_well_chat",
            "timestamp": datetime.now(timezone.utc)
        })
        
        return lead_id
    
    async def start_journey(self, lead_id: str, stage: str, metadata: Dict = None) -> str:
        """
        Start or update customer marketing journey
        """
        journey_id = str(uuid.uuid4())
        
        journey = {
            "id": journey_id,
            "lead_id": lead_id,
            "current_stage": stage,
            "stage_history": [{
                "stage": stage,
                "entered_at": datetime.now(timezone.utc),
                "metadata": metadata or {}
            }],
            "automated_actions": [],
            "status": "active",
            "started_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "metadata": metadata or {}
        }
        
        await db.marketing_journeys.insert_one(journey)
        
        # Schedule automated actions for this stage
        await self.schedule_stage_actions(journey_id, lead_id, stage)
        
        return journey_id
    
    async def advance_to_next_stage(self, lead_id: str, trigger: str = "automatic") -> bool:
        """
        Move customer to next stage in journey
        """
        # Find active journey
        journey = await db.marketing_journeys.find_one({
            "lead_id": lead_id,
            "status": "active"
        })
        
        if not journey:
            return False
        
        current_stage = journey["current_stage"]
        stage_config = JOURNEY_STAGES.get(current_stage)
        
        if not stage_config or not stage_config["next_stage"]:
            return False  # Already at final stage
        
        next_stage = stage_config["next_stage"]
        
        # Update journey
        await db.marketing_journeys.update_one(
            {"id": journey["id"]},
            {
                "$set": {
                    "current_stage": next_stage,
                    "updated_at": datetime.now(timezone.utc)
                },
                "$push": {
                    "stage_history": {
                        "stage": next_stage,
                        "entered_at": datetime.now(timezone.utc),
                        "trigger": trigger
                    }
                }
            }
        )
        
        # Schedule new stage actions
        await self.schedule_stage_actions(journey["id"], lead_id, next_stage)
        
        return True
    
    async def schedule_stage_actions(self, journey_id: str, lead_id: str, stage: str):
        """
        Schedule automated marketing actions for a stage
        """
        stage_config = JOURNEY_STAGES.get(stage)
        if not stage_config:
            return
        
        for action in stage_config["actions"]:
            scheduled_action = {
                "id": str(uuid.uuid4()),
                "journey_id": journey_id,
                "lead_id": lead_id,
                "stage": stage,
                "action_type": action["type"],
                "template": action["template"],
                "scheduled_for": datetime.now(timezone.utc) + timedelta(hours=action["delay_hours"]),
                "status": "scheduled",
                "created_at": datetime.now(timezone.utc)
            }
            
            await db.scheduled_marketing_actions.insert_one(scheduled_action)
    
    async def trigger_event(self, lead_id: str, event_type: str, metadata: Dict = None):
        """
        Handle customer events and update journey accordingly
        """
        # Event-to-stage mapping
        event_stage_map = {
            "chat_started": "awareness",
            "questions_asked": "interest",
            "skin_type_completed": "consideration",
            "package_viewed": "consideration",
            "payment_initiated": "consideration",
            "purchase_completed": "purchase",
            "first_session_completed": "onboarding",
            "third_session_completed": "active",
            "tenth_session_completed": "loyal",
            "referral_made": "advocate",
            "30_days_inactive": "at_risk",
            "60_days_inactive": "churned"
        }
        
        target_stage = event_stage_map.get(event_type)
        if not target_stage:
            return
        
        # Find active journey
        journey = await db.marketing_journeys.find_one({
            "lead_id": lead_id,
            "status": "active"
        })
        
        if not journey:
            # Start new journey if none exists
            await self.start_journey(lead_id, target_stage, metadata)
            return
        
        current_stage = journey["current_stage"]
        
        # Determine if we should advance
        stage_order = list(JOURNEY_STAGES.keys())
        if target_stage in stage_order:
            current_index = stage_order.index(current_stage) if current_stage in stage_order else 0
            target_index = stage_order.index(target_stage)
            
            # Only advance if target stage is ahead
            if target_index > current_index:
                await db.marketing_journeys.update_one(
                    {"id": journey["id"]},
                    {
                        "$set": {
                            "current_stage": target_stage,
                            "updated_at": datetime.now(timezone.utc)
                        },
                        "$push": {
                            "stage_history": {
                                "stage": target_stage,
                                "entered_at": datetime.now(timezone.utc),
                                "trigger": event_type,
                                "metadata": metadata or {}
                            }
                        }
                    }
                )
                
                # Schedule new actions
                await self.schedule_stage_actions(journey["id"], lead_id, target_stage)
    
    async def get_customer_journey(self, lead_id: str) -> Optional[Dict]:
        """
        Get current journey status for a customer
        """
        journey = await db.marketing_journeys.find_one({
            "lead_id": lead_id,
            "status": "active"
        })
        
        if not journey:
            return None
        
        journey.pop('_id', None)
        
        # Get stage info
        current_stage = journey["current_stage"]
        stage_config = JOURNEY_STAGES.get(current_stage, {})
        
        # Get pending actions
        pending_actions = await db.scheduled_marketing_actions.count_documents({
            "journey_id": journey["id"],
            "status": "scheduled"
        })
        
        return {
            "journey_id": journey["id"],
            "current_stage": current_stage,
            "stage_name": stage_config.get("name", ""),
            "stage_description": stage_config.get("description", ""),
            "started_at": journey["started_at"].isoformat() if journey.get("started_at") else None,
            "stage_history": journey.get("stage_history", []),
            "pending_actions": pending_actions,
            "metadata": journey.get("metadata", {})
        }

# Create global instance
journey_manager = MarketingJourneyManager()
