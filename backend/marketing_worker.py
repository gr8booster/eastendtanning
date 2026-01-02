"""
Marketing Worker - Automated Email & SMS Sending
Processes scheduled_marketing_actions from MongoDB and sends emails via SendGrid and SMS via Twilio
"""
import asyncio
import os
from datetime import datetime, timezone
from typing import Dict, Optional
from motor.motor_asyncio import AsyncIOMotorClient
import logging

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
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
SENDGRID_FROM_EMAIL = os.environ.get('SENDGRID_FROM_EMAIL', 'noreply@eastendtanning.com')
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.environ.get('TWILIO_PHONE_NUMBER')

# Initialize clients (lazy)
_sg_client = None
_twilio_client = None

def get_sendgrid_client():
    global _sg_client
    if _sg_client is None and SENDGRID_API_KEY:
        _sg_client = SendGridAPIClient(SENDGRID_API_KEY)
    return _sg_client

def get_twilio_client():
    global _twilio_client
    if _twilio_client is None and TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
        _twilio_client = TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    return _twilio_client


# Email Templates
EMAIL_TEMPLATES = {
    "welcome": {
        "subject": "Welcome to Eastend Tanning & Laundry!",
        "html": """
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #F59E0B 0%, #14B8A6 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">Welcome to Eastend!</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
                <p style="font-size: 16px;">Hi {name},</p>
                <p style="font-size: 16px;">
                    Thank you for your interest in Eastend Tanning & Laundry! We're excited to help you achieve your perfect glow.
                </p>
                <p style="font-size: 16px;">
                    Our team is here to answer any questions you have about our services, packages, and lotions.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://eastend-tanning.preview.emergentagent.com" style="background: #F59E0B; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold;">
                        Explore Services
                    </a>
                </div>
                <p style="font-size: 14px; color: #666;">
                    Best regards,<br>
                    The Eastend Team
                </p>
            </div>
        </body>
        </html>
        """
    },
    "first_visit_reminder": {
        "subject": "Ready to Start Your Tanning Journey?",
        "html": """
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="padding: 30px; background: #f9f9f9;">
                <h2 style="color: #F59E0B;">Don't Miss Out, {name}!</h2>
                <p style="font-size: 16px;">
                    We noticed you haven't booked your first session yet. We'd love to help you get started!
                </p>
                <p style="font-size: 16px;">
                    Chat with Mary Well, our AI assistant, to get personalized package recommendations based on your skin type and goals.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://eastend-tanning.preview.emergentagent.com" style="background: #14B8A6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold;">
                        Chat with Mary
                    </a>
                </div>
            </div>
        </body>
        </html>
        """
    },
    "service_details": {
        "subject": "Learn More About Our {service_interest} Services",
        "html": """
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="padding: 30px; background: #f9f9f9;">
                <h2 style="color: #F59E0B;">Hi {name}!</h2>
                <p style="font-size: 16px;">
                    Thanks for your interest in our {service_interest} services. Here's what makes Eastend special:
                </p>
                <ul style="font-size: 16px; line-height: 1.8;">
                    <li>5 tanning levels from budget to premium Matrix bed</li>
                    <li>Professional skin type evaluation (free)</li>
                    <li>Premium lotions catalog with expert recommendations</li>
                    <li>Flexible packages and monthly memberships</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://eastend-tanning.preview.emergentagent.com/tanning" style="background: #F59E0B; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold;">
                        View Packages
                    </a>
                </div>
            </div>
        </body>
        </html>
        """
    },
    "special_offer": {
        "subject": "🎉 Special Offer Just for You!",
        "html": """
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background: #F59E0B; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Limited Time Offer!</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
                <p style="font-size: 16px;">Hi {name},</p>
                <p style="font-size: 18px; font-weight: bold; color: #14B8A6;">
                    Get 15% off your first tanning package!
                </p>
                <p style="font-size: 16px;">
                    Chat with Mary Well to generate your exclusive discount code and start your tanning journey today.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://eastend-tanning.preview.emergentagent.com" style="background: #14B8A6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold;">
                        Get Your Code
                    </a>
                </div>
            </div>
        </body>
        </html>
        """
    },
    "package_recommendations": {
        "subject": "Perfect Packages for Your Skin Type",
        "html": """
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="padding: 30px; background: #f9f9f9;">
                <h2 style="color: #F59E0B;">Hi {name}!</h2>
                <p style="font-size: 16px;">
                    Based on your skin type evaluation, we've selected the perfect tanning packages for you:
                </p>
                <div style="background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #14B8A6;">
                    <h3 style="color: #14B8A6; margin-top: 0;">Recommended: Level 4 Premium Bed</h3>
                    <p>High-pressure lamps for faster, deeper tan. Perfect for experienced tanners.</p>
                    <p style="font-weight: bold;">From $79.99/month</p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://eastend-tanning.preview.emergentagent.com" style="background: #F59E0B; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold;">
                        Book Now
                    </a>
                </div>
            </div>
        </body>
        </html>
        """
    },
    "limited_time_offer": {
        "subject": "⏰ 24 Hours Left: Your Exclusive Discount",
        "html": """
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background: #E11D48; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">⏰ Hurry! Offer Expires Soon</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
                <p style="font-size: 16px;">Hi {name},</p>
                <p style="font-size: 18px; font-weight: bold;">
                    Your 15% discount code expires in 24 hours!
                </p>
                <p style="font-size: 16px;">
                    Don't miss out on this exclusive offer. Book your tanning package today and save big.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://eastend-tanning.preview.emergentagent.com" style="background: #E11D48; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold;">
                        Use My Code
                    </a>
                </div>
            </div>
        </body>
        </html>
        """
    },
    "purchase_confirmation": {
        "subject": "Thank You for Your Purchase!",
        "html": """
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background: #10B981; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">✓ Purchase Confirmed!</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
                <p style="font-size: 16px;">Hi {name},</p>
                <p style="font-size: 16px;">
                    Thank you for your purchase! We're excited to have you as part of the Eastend family.
                </p>
                <p style="font-size: 16px;">
                    Visit us at either location to start your sessions:
                </p>
                <div style="background: white; padding: 15px; margin: 15px 0;">
                    <strong>Eastend Location:</strong> 102 Martinsburg Rd, Mount Vernon, OH
                </div>
                <div style="background: white; padding: 15px; margin: 15px 0;">
                    <strong>Westend Location:</strong> 1225 Newark Rd, Mount Vernon, OH
                </div>
            </div>
        </body>
        </html>
        """
    },
    "first_session_feedback": {
        "subject": "How Was Your First Session?",
        "html": """
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="padding: 30px; background: #f9f9f9;">
                <h2 style="color: #F59E0B;">Hi {name}!</h2>
                <p style="font-size: 16px;">
                    We hope you enjoyed your first tanning session! We'd love to hear your feedback.
                </p>
                <p style="font-size: 16px;">
                    Tips for your next visit:
                </p>
                <ul style="font-size: 16px; line-height: 1.8;">
                    <li>Use a quality lotion for best results</li>
                    <li>Stay hydrated before and after</li>
                    <li>Wait 24-48 hours between sessions</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://eastend-tanning.preview.emergentagent.com" style="background: #14B8A6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold;">
                        Browse Lotions
                    </a>
                </div>
            </div>
        </body>
        </html>
        """
    }
}

# SMS Templates (160 characters max recommended)
SMS_TEMPLATES = {
    "first_visit_reminder": "Hi {name}! Ready to start tanning? Chat with Mary at eastendtanning.com to find your perfect package. -Eastend Team",
    "special_offer": "🎉 {name}, get 15% off your first package! Chat with Mary now: eastendtanning.com -Eastend",
    "booking_reminder": "Hi {name}! Don't forget your tanning session at Eastend. See you soon! -Eastend",
    "limited_time_offer": "⏰ {name}, your 15% discount expires in 24hrs! Book now: eastendtanning.com -Eastend",
    "tips_and_best_practices": "Tanning tip: Use quality lotion for best results! Browse our catalog at eastendtanning.com -Eastend",
    "weekly_specials": "This week's special: 10% off Level 4 beds! Chat with Mary to claim: eastendtanning.com -Eastend",
    "loyalty_rewards": "You're a VIP, {name}! Ask Mary about our loyalty rewards: eastendtanning.com -Eastend",
    "comeback_discount": "We miss you, {name}! Get 20% off your next visit: eastendtanning.com -Eastend",
    "last_chance": "Last chance, {name}! Your special offer expires today. Book now: eastendtanning.com -Eastend"
}


async def send_email(to_email: str, subject: str, html_content: str) -> bool:
    """Send email via SendGrid"""
    sg_client = get_sendgrid_client()
    if not sg_client:
        logger.warning("SendGrid not configured. Skipping email send.")
        return False
    
    try:
        message = Mail(
            from_email=SENDGRID_FROM_EMAIL,
            to_emails=to_email,
            subject=subject,
            html_content=html_content
        )
        response = sg_client.send(message)
        logger.info(f"Email sent to {to_email}: status {response.status_code}")
        return response.status_code in (200, 202)
    except Exception as e:
        logger.error(f"SendGrid error: {e}")
        return False


async def send_sms(to_phone: str, message: str) -> bool:
    """Send SMS via Twilio"""
    twilio_client = get_twilio_client()
    if not twilio_client or not TWILIO_PHONE_NUMBER:
        logger.warning("Twilio not configured. Skipping SMS send.")
        return False
    
    try:
        result = twilio_client.messages.create(
            to=to_phone,
            from_=TWILIO_PHONE_NUMBER,
            body=message
        )
        logger.info(f"SMS sent to {to_phone}: sid {result.sid}")
        return True
    except Exception as e:
        logger.error(f"Twilio error: {e}")
        return False


async def process_marketing_action(action: Dict) -> bool:
    """Process a single marketing action (email or SMS)"""
    action_type = action.get("action_type")
    template = action.get("template")
    lead_id = action.get("lead_id")
    
    # Fetch lead data
    lead = await db.leads.find_one({"id": lead_id})
    if not lead:
        logger.warning(f"Lead {lead_id} not found for action {action.get('id')}")
        return False
    
    # Prepare template data
    template_data = {
        "name": lead.get("name", "Valued Customer"),
        "service_interest": lead.get("service_interest", "tanning")
    }
    
    success = False
    
    if action_type == "email":
        email_template = EMAIL_TEMPLATES.get(template)
        if not email_template or not lead.get("email"):
            logger.warning(f"Email template '{template}' not found or lead has no email")
            return False
        
        subject = email_template["subject"].format(**template_data)
        html_content = email_template["html"].format(**template_data)
        success = await send_email(lead.get("email"), subject, html_content)
    
    elif action_type == "sms":
        sms_template = SMS_TEMPLATES.get(template)
        if not sms_template or not lead.get("phone"):
            logger.warning(f"SMS template '{template}' not found or lead has no phone")
            return False
        
        message = sms_template.format(**template_data)
        success = await send_sms(lead.get("phone"), message)
    
    return success


async def worker_loop():
    """Main worker loop - processes scheduled marketing actions"""
    logger.info("Marketing worker started")
    
    # Check if services are configured
    if not SENDGRID_API_KEY:
        logger.warning("SENDGRID_API_KEY not set. Email sending disabled.")
    if not (TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN):
        logger.warning("Twilio credentials not set. SMS sending disabled.")
    
    while True:
        try:
            now = datetime.now(timezone.utc)
            
            # Find actions that are due
            cursor = db.scheduled_marketing_actions.find({
                "status": "scheduled",
                "scheduled_for": {"$lte": now}
            }).limit(50)
            
            processed_count = 0
            async for action in cursor:
                action_id = action.get("id")
                logger.info(f"Processing action {action_id}: {action.get('action_type')} - {action.get('template')}")
                
                success = await process_marketing_action(action)
                
                if success:
                    await db.scheduled_marketing_actions.update_one(
                        {"id": action_id},
                        {"$set": {
                            "status": "sent",
                            "sent_at": datetime.now(timezone.utc)
                        }}
                    )
                    processed_count += 1
                else:
                    await db.scheduled_marketing_actions.update_one(
                        {"id": action_id},
                        {"$set": {
                            "status": "failed",
                            "failed_at": datetime.now(timezone.utc),
                            "error": "Delivery failed - check logs"
                        }}
                    )
            
            if processed_count > 0:
                logger.info(f"Processed {processed_count} marketing actions")
            
        except Exception as e:
            logger.error(f"Worker error: {e}")
        
        # Sleep for 5 minutes before next check
        await asyncio.sleep(300)
