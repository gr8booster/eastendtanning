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
db = client[os.environ.get('DB_NAME', 'test_database')]

# Store active chat sessions in memory
active_chats = {}

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
        
        # Auto-capture lead if customer provides contact information
        await auto_capture_lead_from_message(session_id, chat_message.message, response)
        
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
