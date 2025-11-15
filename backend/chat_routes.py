"""
Chat API routes for Mary Well AI Assistant
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime, timezone
import uuid

from mary_well import mary_well
from motor.motor_asyncio import AsyncIOMotorClient
from marketing_journey import journey_manager
import os
import re

router = APIRouter(prefix="/api/chat", tags=["chat"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'eastend_db')]

# Store active chat sessions in memory
active_chats = {}

REASONS = ["wedding", "weddings", "vacation", "trip", "beach", "prom", "event", "photos", "photoshoot", "competition"]

def extract_reason(text: str) -> Optional[str]:
    t = text.lower()
    for r in REASONS:
        if r in t:
            return r
    return None

async def auto_capture_lead_from_message(session_id: str, user_message: str, ai_response: str):
    """
    Automatically detect and capture lead information from chat messages
    Also capture tanning reason and link lead_id to chat session
    """
    # Patterns to detect contact information
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    phone_pattern = r'(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
    name_pattern = r'(?:my name is|i\'m|i am|call me)\s+([A-Za-z\s]{2,30})'
    
    # Extract information
    emails = re.findall(email_pattern, user_message, re.IGNORECASE)
    phones = re.findall(phone_pattern, user_message)
    names = re.findall(name_pattern, user_message, re.IGNORECASE)

    # Determine service interest
    service_interest = "tanning"
    if any(word in user_message.lower() for word in ["laundry", "wash", "dry clean"]):
        service_interest = "laundry"
    elif any(word in user_message.lower() for word in ["tan", "bronze", "uv", "sunless"]):
        service_interest = "tanning"

    # Determine reason if present
    reason = extract_reason(user_message)

    # Prepare customer data
    customer_data = {
        "chat_session_id": session_id,
        "email": emails[0] if emails else "",
        "phone": ''.join(phones[0]) if phones else "",
        "name": names[0].strip() if names else "",
        "service_interest": service_interest,
        "notes": f"Auto-captured from chat. User said: '{user_message[:100]}...'"
    }

    # Only capture if we have at least email or phone
    if customer_data["email"] or customer_data["phone"]:
        try:
            lead_id = await journey_manager.capture_lead_from_chat(customer_data)
            # Link to chat session record
            await db.chat_sessions.update_one({"session_id": session_id}, {"$set": {"lead_id": lead_id}})
            # Save reason if we have one
            if reason:
                await db.leads.update_one({"id": lead_id}, {"$set": {"tanning_reason": reason, "updated_at": datetime.now(timezone.utc)}})
            print(f"Auto-captured lead {lead_id} from session {session_id}")
        except Exception as e:
            print(f"Error auto-capturing lead: {str(e)}")

class ChatMessage(BaseModel):
    session_id: str
    message: str
    user_type: str = "customer"  # customer or ai

class ChatResponse(BaseModel):
    session_id: str
    response: str
    timestamp: str

class ChatHistory(BaseModel):
    session_id: str
    messages: List[Dict]

@router.post("/start", response_model=Dict)
async def start_chat_session():
    """Start a new chat session with Mary Well"""
    session_id = str(uuid.uuid4())
    
    # Create new chat instance
    chat = await mary_well.create_chat_session(session_id)
    active_chats[session_id] = chat
    
    # Store session in database
    await db.chat_sessions.insert_one({
        "session_id": session_id,
        "started_at": datetime.now(timezone.utc),
        "status": "active",
        "messages": []
    })
    
    return {
        "session_id": session_id,
        "message": "Chat session started",
        "greeting": "Hi! I'm Mary Well, your virtual assistant at Eastend Tanning & Laundry. How can I help you today?"
    }

@router.post("/message", response_model=ChatResponse)
async def send_message(chat_message: ChatMessage):
    """Send a message to Mary Well and get response"""
    session_id = chat_message.session_id
    
    # Get or create chat session
    if session_id not in active_chats:
        chat = await mary_well.create_chat_session(session_id)
        active_chats[session_id] = chat
    else:
        chat = active_chats[session_id]
    
    try:
        # Get AI response
        response = await mary_well.send_message(chat, chat_message.message)
        
        # Auto-capture lead if customer provides contact information + reason
        await auto_capture_lead_from_message(session_id, chat_message.message, response)
        
        # Check if customer provided name/phone in message (during consultation)
        # Pattern: name and phone number
        name_match = re.search(r'(?:my name is|i\'m|i am|call me|name:)\s*([A-Za-z\s]{2,40})', chat_message.message, re.IGNORECASE)
        phone_match = re.search(r'(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})', chat_message.message)
        
        # If both name and phone detected, create customer profile
        if name_match and phone_match:
            name = name_match.group(1).strip()
            phone = ''.join(filter(str.isdigit, phone_match.group(1)))
            
            # Create or retrieve customer profile directly in database
            try:
                # Check if customer exists
                existing = await db.customer_profiles.find_one({"phone": phone})
                
                if not existing:
                    # Create new customer profile
                    import uuid
                    customer_id = str(uuid.uuid4())
                    profile = {
                        "customer_id": customer_id,
                        "name": name,
                        "phone": phone,
                        "email": None,
                        "skin_type": None,
                        "tanning_reason": None,
                        "recommended_bed_level": None,
                        "recommended_package": None,
                        "consultation_history": [],
                        "purchase_history": [],
                        "preferences": {},
                        "created_at": datetime.now(timezone.utc),
                        "last_consultation": None,
                        "total_consultations": 0,
                        "last_session_id": session_id
                    }
                    await db.customer_profiles.insert_one(profile)
                
                # Link customer to session
                await db.chat_sessions.update_one(
                    {"session_id": session_id},
                    {"$set": {"customer_name": name, "customer_phone": phone}}
                )
            except Exception as e:
                # Silent fail if customer creation fails
                print(f"Error creating customer profile: {e}")
        
        # Store messages in database
        await db.chat_sessions.update_one(
            {"session_id": session_id},
            {
                "$push": {
                    "messages": {
                        "$each": [
                            {
                                "role": "user",
                                "content": chat_message.message,
                                "timestamp": datetime.now(timezone.utc)
                            },
                            {
                                "role": "assistant",
                                "content": response,
                                "timestamp": datetime.now(timezone.utc)
                            }
                        ]
                    }
                },
                "$set": {"last_active": datetime.now(timezone.utc)}
            },
            upsert=True
        )
        
        return ChatResponse(
            session_id=session_id,
            response=response,
            timestamp=datetime.now(timezone.utc).isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@router.get("/history/{session_id}", response_model=ChatHistory)
async def get_chat_history(session_id: str):
    """Get chat history for a session"""
    session = await db.chat_sessions.find_one({"session_id": session_id})
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Remove MongoDB _id field
    session.pop('_id', None)
    
    return ChatHistory(
        session_id=session_id,
        messages=session.get("messages", [])
    )

@router.get("/packages")
async def get_tanning_packages():
    """Get all available tanning packages with prices"""
    return mary_well.get_tanning_packages()

@router.post("/end/{session_id}")
async def end_chat_session(session_id: str):
    """End a chat session"""
    # Remove from active chats
    if session_id in active_chats:
        del active_chats[session_id]
    
    # Update database
    await db.chat_sessions.update_one(
        {"session_id": session_id},
        {"$set": {
            "status": "ended",
            "ended_at": datetime.now(timezone.utc)
        }}
    )
    
    return {"message": "Chat session ended"}
