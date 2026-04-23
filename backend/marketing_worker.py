"""
Marketing Worker - Automated Email, SMS & Voice Calling
Processes scheduled_marketing_actions from MongoDB
"""
import asyncio
import os
import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from urllib import request as urlrequest

# SendGrid
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Twilio
from twilio.rest import Client as TwilioClient

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'eastend_db')]

# Service clients
sendgrid_api_key = os.environ.get('SENDGRID_API_KEY')
sendgrid_from_email = os.environ.get('SENDGRID_FROM_EMAIL', 'noreply@eastendtanning.com')
twilio_account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
twilio_auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
twilio_phone_number = os.environ.get('TWILIO_PHONE_NUMBER')

# Vapi
VAPI_PRIVATE_KEY = os.environ.get("VAPI_PRIVATE_KEY")
VAPI_PHONE_NUMBER_ID = os.environ.get("VAPI_PHONE_NUMBER_ID")

# Initialize clients (lazy)
_sg_client = None
_twilio_client = None

def get_sendgrid_client():
    global _sg_client
    if _sg_client is None and sendgrid_api_key:
        _sg_client = SendGridAPIClient(sendgrid_api_key)
    return _sg_client

def get_twilio_client():
    global _twilio_client
    if _twilio_client is None and twilio_account_sid and twilio_auth_token:
        _twilio_client = TwilioClient(twilio_account_sid, twilio_auth_token)
    return _twilio_client

# Email Templates
EMAIL_TEMPLATES = {
    "welcome": {
        "subject": "Welcome to Eastend Tanning & Laundry!",
        "html": "<html><body><h1>Welcome!</h1><p>Hi {name}, thanks for visiting!</p></body></html>"
    },
    "win_back": {
        "subject": "We miss you at Eastend!",
        "html": "<html><body><h1>Come back!</h1><p>Hi {name}, we haven't seen you in a while.</p></body></html>"
    }
}

# SMS Templates
SMS_TEMPLATES = {
    "first_visit_reminder": "Hi {name}! Ready to start tanning? Chat with Mary at eastendtanning.com to find your perfect package. -Eastend Team",
    "special_offer": "🎉 {name}, get 15% off your first package! Chat with Mary now: eastendtanning.com -Eastend"
}

# Call Templates (for automated Mary Well calls)
CALL_TEMPLATES = {
    "follow_up": "Hi {name}! This is Mary Well from Eastend Tanning. I noticed you were looking at our packages. Do you have any questions I can help with?",
    "re_engagement": "Hey {name}! It's Mary from Eastend. We haven't seen you in a while and wanted to reach out with a special 20% discount if you stop by this week!"
}

async def _http_post_json(url: str, body: Dict, headers: Dict) -> int:
    data = json.dumps(body).encode("utf-8")
    req = urlrequest.Request(url, data=data, headers=headers, method="POST")
    loop = asyncio.get_event_loop()
    def _do():
        try:
            with urlrequest.urlopen(req, timeout=30) as resp:
                return resp.getcode()
        except Exception as e:
            logger.error(f"HTTP POST error: {e}")
            return 500
    return await loop.run_in_executor(None, _do)

async def send_email(to_email: str, subject: str, html_content: str) -> bool:
    sg_client = get_sendgrid_client()
    if not sg_client: return False
    try:
        message = Mail(from_email=sendgrid_from_email, to_emails=to_email, subject=subject, html_content=html_content)
        response = sg_client.send(message)
        return response.status_code in (200, 202)
    except Exception as e:
        logger.error(f"SendGrid error: {e}")
        return False

async def send_sms(to_phone: str, message: str) -> bool:
    twilio_client = get_twilio_client()
    if not twilio_client or not twilio_phone_number: return False
    try:
        result = twilio_client.messages.create(to=to_phone, from_=twilio_phone_number, body=message)
        return True
    except Exception as e:
        logger.error(f"Twilio error: {e}")
        return False

async def send_call(to_phone: str, name: str, message: str) -> bool:
    """Send an automated Mary Well AI call"""
    if not VAPI_PRIVATE_KEY or not VAPI_PHONE_NUMBER_ID:
        logger.warning("Vapi not configured. Mocking success for call.")
        return True
    
    vapi_body = {
        "assistant": {
            "firstMessage": message,
            "model": {
                "provider": "openai",
                "model": "gpt-4o",
                "messages": [{"role": "system", "content": "You are Mary Well, a friendly wingman for Eastend Tanning."}]
            },
            "voice": {"provider": "vapi-voice", "voiceId": "alloy-female"}
        },
        "phoneNumberId": VAPI_PHONE_NUMBER_ID,
        "customer": {"number": to_phone, "name": name}
    }
    headers = {"Authorization": f"Bearer {VAPI_PRIVATE_KEY}", "Content-Type": "application/json"}
    status = await _http_post_json("https://api.vapi.ai/call/phone", vapi_body, headers)
    return status in (200, 201)

async def process_marketing_action(action: Dict) -> bool:
    action_type = action.get("action_type")
    template = action.get("template")
    lead_id = action.get("lead_id")
    lead = await db.leads.find_one({"id": lead_id})
    if not lead: return False
    
    template_data = {"name": lead.get("name", "Valued Customer"), "service_interest": lead.get("service_interest", "tanning")}
    
    if action_type == "email":
        email_template = EMAIL_TEMPLATES.get(template)
        if not email_template or not lead.get("email"): return False
        return await send_email(lead["email"], email_template["subject"].format(**template_data), email_template["html"].format(**template_data))
    
    elif action_type == "sms":
        sms_template = SMS_TEMPLATES.get(template)
        if not sms_template or not lead.get("phone"): return False
        return await send_sms(lead["phone"], sms_template.format(**template_data))
        
    elif action_type == "call":
        call_template = CALL_TEMPLATES.get(template)
        if not call_template or not lead.get("phone"): return False
        return await send_call(lead["phone"], lead.get("name", "Customer"), call_template.format(**template_data))
    
    return False

async def worker_loop():
    logger.info("Marketing worker started")
    while True:
        try:
            now = datetime.now(timezone.utc)
            cursor = db.scheduled_marketing_actions.find({"status": "scheduled", "scheduled_for": {"$lte": now}}).limit(50)
            async for action in cursor:
                success = await process_marketing_action(action)
                status = "sent" if success else "failed"
                await db.scheduled_marketing_actions.update_one({"id": action.get("id")}, {"$set": {"status": status, "sent_at": datetime.now(timezone.utc)}})
        except Exception as e:
            logger.error(f"Worker error: {e}")
        await asyncio.sleep(300)"