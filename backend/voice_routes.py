"""
Voice AI (Phone) Integration Routes using Vapi
- Outbound call trigger (supports mock mode when provider keys are absent)
- Webhook receiver for inbound/status/end-of-call events
- HMAC verification for webhook security
- Persists transcripts to leads and advances marketing journey
"""
from fastapi import APIRouter, HTTPException, Request, Query
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from marketing_journey import journey_manager
import uuid
import os
import hmac
import hashlib
import json
import asyncio
from urllib import request as urlrequest

router = APIRouter(prefix="/api/voice", tags=["voice"])

# Env
VAPI_PRIVATE_KEY = os.environ.get("VAPI_PRIVATE_KEY")
VAPI_WEBHOOK_SECRET = os.environ.get("VAPI_WEBHOOK_SECRET")
VAPI_PHONE_NUMBER_ID = os.environ.get("VAPI_PHONE_NUMBER_ID")  # provisioned number id

# Mongo
mongo_url = os.environ.get("MONGO_URL")
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get("DB_NAME", "eastend_db")]


class CustomerInfo(BaseModel):
    phone: str = Field(..., description="Customer phone number in E.164 or local format")
    name: Optional[str] = None
    email: Optional[str] = None

class OutboundCallRequest(BaseModel):
    customer: CustomerInfo
    metadata: Optional[Dict[str, Any]] = None


async def _http_post_json(url: str, body: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    data = json.dumps(body).encode("utf-8")
    req = urlrequest.Request(url, data=data, headers=headers, method="POST")
    loop = asyncio.get_event_loop()
    def _do():
        try:
            with urlrequest.urlopen(req, timeout=30) as resp:
                resp_body = resp.read().decode("utf-8")
                return resp.getcode(), resp_body
        except Exception as e:
            raise e
    status, resp_body = await loop.run_in_executor(None, _do)
    try:
        parsed = json.loads(resp_body) if resp_body else {}
    except Exception:
        parsed = {"raw": resp_body}
    return {"status": status, "json": parsed}


def _normalize_phone(phone: str) -> str:
    # Minimal normalization; Vapi accepts +1XXXXXXXXXX. Leave advanced parsing to provider
    p = phone.strip()
    if p.startswith("+"):
        return p
    # assume US if 10 digits
    digits = ''.join(ch for ch in p if ch.isdigit())
    if len(digits) == 10:
        return "+1" + digits
    return "+" + digits if not digits.startswith("+") else digits


def _mock_mode() -> bool:
    return not (VAPI_PRIVATE_KEY and VAPI_PHONE_NUMBER_ID)


@router.post("/calls/outbound")
async def create_outbound_call(payload: OutboundCallRequest):
    """Initiate an outbound phone call via Vapi.
    If provider is not configured, runs in mock mode and immediately logs a successful mock call,
    creates/updates a lead, and triggers the marketing journey.
    """
    customer_number = _normalize_phone(payload.customer.phone)

    # If not configured, return mock success and create records
    if _mock_mode():
        call_id = str(uuid.uuid4())
        # Upsert lead
        lead = await db.leads.find_one({"phone": customer_number})
        if not lead:
            lead_id = str(uuid.uuid4())
            await db.leads.insert_one({
                "id": lead_id,
                "name": payload.customer.name or "Voice Request",
                "email": payload.customer.email,
                "phone": customer_number,
                "source": "voice_call_request",
                "service_interest": "tanning",
                "status": "new",
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            })
            try:
                await journey_manager.capture_lead_from_chat({
                    "name": payload.customer.name or "Voice Request",
                    "email": payload.customer.email,
                    "phone": customer_number,
                    "service_interest": "tanning",
                    "notes": "Lead captured via voice call request (mock mode)"
                })
            except Exception as e:
                print(f"journey start error: {e}")
        else:
            lead_id = lead["id"]
            await db.leads.update_one(
                {"id": lead_id},
                {"$set": {"updated_at": datetime.now(timezone.utc)}}
            )

        await db.voice_calls.insert_one({
            "id": call_id,
            "direction": "outbound",
            "customer_number": customer_number,
            "customer_name": payload.customer.name,
            "status": "mocked",
            "summary": "Preview call created (provider not configured).",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        })
        return {"status": "success", "call_id": call_id, "mode": "mock"}

    # Real provider flow
    if not VAPI_PRIVATE_KEY or not VAPI_PHONE_NUMBER_ID:
        raise HTTPException(status_code=400, detail="Voice provider not configured. Please set VAPI_PRIVATE_KEY and VAPI_PHONE_NUMBER_ID.")

    # Compose assistant config: female, friendly voice; no recording; transcripts enabled
    vapi_body = {
        "assistant": {
            "firstMessage": "Hi! This is Mary from Eastend. How can I help you today?",
            "model": {
                "provider": "openai",
                "model": "gpt-4o",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are Mary Well, a friendly, kind professional assistant for Eastend Tanning & Laundry. Be concise, helpful, and personable."
                    }
                ]
            },
            "voice": {
                "provider": "vapi-voice",
                "voiceId": "alloy-female"
            },
            "transcriber": {
                "provider": "deepgram",
                "model": "nova-2"
            },
            "artifactPlan": {
                "recordingEnabled": False,
                "transcriptPlan": {"enabled": True}
            }
        },
        "phoneNumberId": VAPI_PHONE_NUMBER_ID,
        "customer": {
            "number": customer_number,
            "name": payload.customer.name or "Customer"
        },
        "metadata": payload.metadata or {}
    }

    headers = {
        "Authorization": f"Bearer {VAPI_PRIVATE_KEY}",
        "Content-Type": "application/json"
    }

    try:
        resp = await _http_post_json("https://api.vapi.ai/call/phone", vapi_body, headers)
        if resp["status"] not in (200, 201):
            raise HTTPException(status_code=resp["status"], detail=f"Provider error: {resp['json']}")

        call_id = resp["json"].get("id") or str(uuid.uuid4())
        # Log minimal call record
        await db.voice_calls.insert_one({
            "id": call_id,
            "direction": "outbound",
            "customer_number": customer_number,
            "customer_name": payload.customer.name,
            "status": "initiated",
            "created_at": datetime.now(timezone.utc)
        })
        return {"status": "success", "call_id": call_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _verify_signature(raw_body: bytes, signature: str) -> bool:
    if not VAPI_WEBHOOK_SECRET:
        # If not configured, allow (dev), but prefer to configure
        return True
    try:
        expected = hmac.new(VAPI_WEBHOOK_SECRET.encode(), raw_body, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature or "")
    except Exception:
        return False


@router.post("/webhook/calls")
async def vapi_webhook(request: Request):
    """Receive Vapi call webhooks: transcript updates and end-of-call reports"""
    raw = await request.body()
    signature = request.headers.get("X-Vapi-Signature", "")
    if not _verify_signature(raw, signature):
        raise HTTPException(status_code=401, detail="Invalid signature")

    try:
        body = json.loads(raw.decode("utf-8")) if raw else {}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    msg = (body or {}).get("message", {})
    msg_type = msg.get("type")

    # Track basic call state
    call_obj = msg.get("call", {})
    call_id = call_obj.get("id") or str(uuid.uuid4())
    customer_number = ((call_obj.get("customer") or {}).get("number") or "").strip()

    # Persist transcript at end-of-call
    if msg_type == "end-of-call-report":
        artifact = msg.get("artifact", {})
        transcript = artifact.get("transcript", "")
        messages = artifact.get("messages", [])
        ended_reason = msg.get("endedReason", "unknown")
        analysis = msg.get("analysis", {})
        summary = analysis.get("summary")

        # Upsert a lead by phone
        lead = await db.leads.find_one({"phone": customer_number}) if customer_number else None
        if lead:
            await db.leads.update_one(
                {"id": lead["id"]},
                {"$set": {
                    "last_call_transcript": transcript,
                    "last_call_summary": summary,
                    "last_called_at": datetime.now(timezone.utc),
                    "updated_at": datetime.now(timezone.utc)
                }}
            )
            lead_id = lead["id"]
        else:
            lead_id = str(uuid.uuid4())
            await db.leads.insert_one({
                "id": lead_id,
                "name": (call_obj.get("customer") or {}).get("name") or "Voice Caller",
                "phone": customer_number,
                "email": None,
                "source": "voice_call",
                "service_interest": "tanning",
                "status": "new",
                "last_call_transcript": transcript,
                "last_call_summary": summary,
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            })
            # Start marketing journey for new lead
            try:
                await journey_manager.capture_lead_from_chat({
                    "name": "Voice Caller",
                    "email": None,
                    "phone": customer_number,
                    "service_interest": "tanning",
                    "notes": "Lead captured via voice AI"
                })
            except Exception as e:
                print(f"journey start error: {e}")

        # Store voice call record with transcript
        await db.voice_calls.update_one(
            {"id": call_id},
            {"$set": {
                "direction": "inbound" if call_obj.get("direction") == "inbound" else "outbound",
                "customer_number": customer_number,
                "ended_reason": ended_reason,
                "transcript": transcript,
                "messages": messages,
                "summary": summary,
                "updated_at": datetime.now(timezone.utc),
                "lead_id": lead_id
            }, "$setOnInsert": {"created_at": datetime.now(timezone.utc)}},
            upsert=True
        )
        return {"status": "ok"}

    # Optionally track transcript updates during call (store last partial)
    if msg_type == "transcript-update":
        partial = (msg.get("artifact") or {}).get("partial", "")
        if partial:
            await db.voice_calls.update_one(
                {"id": call_id}, {"$set": {"last_partial": partial, "updated_at": datetime.now(timezone.utc)}}, upsert=True
            )
        return {"status": "ok"}

    # Fallback
    return {"status": "ignored", "type": msg_type}


@router.get("/calls")
async def list_voice_calls(limit: int = Query(default=50, ge=1, le=200)) -> Dict[str, Any]:
    items: List[Dict[str, Any]] = []
    cursor = db.voice_calls.find({}).sort("created_at", -1).limit(limit)
    async for doc in cursor:
        d = dict(doc)
        d.pop("_id", None)
        # serialize datetimes
        for k in ["created_at", "updated_at"]:
            if k in d and hasattr(d[k], "isoformat"):
                d[k] = d[k].isoformat()
        items.append(d)
    return {"calls": items}
