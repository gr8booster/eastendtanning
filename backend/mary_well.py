"""Mary Well AI Assistant - Chat and Onboarding System
Handles text conversations, appointment booking, payments, and skin type evaluation
Updated to operate as a "Wingman" for the website
"""
from emergentintegrations.llm.chat import LlmChat, UserMessage
import uuid
import os
from datetime import datetime, timezone
from typing import Dict, List, Optional

# Get Emergent LLM key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', 'sk-emergent-057Bd2801D88b71Ce3')

def get_current_discount():
    """Get the current holiday/seasonal discount based on today's date"""
    now = datetime.now()
    year = now.year
    month = now.month
    day = now.day
    
    # Define all discounts with their date ranges
    discounts = [
        # New Year's (Dec 26 - Jan 7)
        {
            "name": "New Year's Sale",
            "emoji": "🎆",
            "tagline": "New Year, New Glow!",
            "description": "Start the new year with a fresh tan! Special New Year pricing on all packages.",
            "percent": 20,
            "code": f"NEWYEAR{year}",
            "start": (12, 26),  # Dec 26 of previous year
            "end": (1, 7),
            "applies_to": "all tanning packages, monthly unlimited, and single sessions"
        },
        # Valentine's Day (Feb 7-14)
        {
            "name": "Valentine's Day Special",
            "emoji": "💕",
            "tagline": "Glow for Your Love!",
            "description": "Look your best for Valentine's Day! Couples and singles welcome.",
            "percent": 15,
            "code": f"LOVE{year}",
            "start": (2, 7),
            "end": (2, 14),
            "applies_to": "all tanning packages"
        },
        # Spring Break (Mar 1-21)
        {
            "name": "Spring Break Glow",
            "emoji": "🌴",
            "tagline": "Get Beach Ready!",
            "description": "Build your base tan before spring break vacation! Limited time pricing.",
            "percent": 20,
            "code": f"SPRING{year}",
            "start": (3, 1),
            "end": (3, 21),
            "applies_to": "all tanning packages, especially 10-packs for vacation prep"
        },
        # St. Patrick's Day (Mar 14-17)
        {
            "name": "St. Patrick's Day",
            "emoji": "☘️",
            "tagline": "Lucky Golden Glow!",
            "description": "Get lucky with our St. Patrick's Day deals!",
            "percent": 17,
            "code": "LUCKY17",
            "start": (3, 14),
            "end": (3, 17),
            "applies_to": "all services"
        },
        # Mother's Day (May 4-11)
        {
            "name": "Mother's Day Special",
            "emoji": "💐",
            "tagline": "Treat Mom to a Glow!",
            "description": "Gift mom the glow she deserves! Perfect Mother's Day packages.",
            "percent": 20,
            "code": f"MOM{year}",
            "start": (5, 4),
            "end": (5, 11),
            "applies_to": "all tanning packages and nail services"
        },
        # Memorial Day (May 22-26)
        {
            "name": "Memorial Day Sale",
            "emoji": "🇺🇸",
            "tagline": "Summer Kickoff Savings!",
            "description": "Kick off summer with our Memorial Day deals!",
            "percent": 25,
            "code": f"MEMORIAL{year}",
            "start": (5, 22),
            "end": (5, 26),
            "applies_to": "all tanning packages"
        },
        # July 4th (Jun 30 - Jul 5)
        {
            "name": "Independence Day Sale",
            "emoji": "🎇",
            "tagline": "Freedom to Glow!",
            "description": "Celebrate America with explosive savings!",
            "percent": 25,
            "code": f"USA{year}",
            "start": (6, 30),
            "end": (7, 5),
            "applies_to": "all services including Fizze drinks"
        },
        # Founder's Day 8/18 (Aug 17-19)
        {
            "name": "Founder's Day (8/18)",
            "emoji": "🏆",
            "tagline": "818 Day Celebration!",
            "description": "Celebrating our address 818 Coshocton Ave! Special anniversary deals.",
            "percent": 18,
            "code": "FOUNDERS818",
            "start": (8, 17),
            "end": (8, 19),
            "applies_to": "all services - our special anniversary celebration"
        },
        # Back to School (Aug 1-20)
        {
            "name": "Back to School",
            "emoji": "📓",
            "tagline": "Start the Year Glowing!",
            "description": "Students & teachers get ready to shine!",
            "percent": 15,
            "code": f"SCHOOL{year}",
            "start": (8, 1),
            "end": (8, 20),
            "applies_to": "all tanning packages"
        },
        # Labor Day (Aug 29 - Sep 2)
        {
            "name": "Labor Day Weekend",
            "emoji": "👷",
            "tagline": "You Work Hard, Save Easy!",
            "description": "Take a break and treat yourself this Labor Day weekend!",
            "percent": 20,
            "code": f"LABOR{year}",
            "start": (8, 29),
            "end": (9, 2),
            "applies_to": "all tanning and laundry services"
        },
        # Halloween (Oct 24-31)
        {
            "name": "Halloween Spooktacular",
            "emoji": "🎃",
            "tagline": "Frighteningly Good Deals!",
            "description": "Get a killer tan for Halloween! Spooky savings all week.",
            "percent": 20,
            "code": f"SPOOKY{year}",
            "start": (10, 24),
            "end": (10, 31),
            "applies_to": "all services"
        },
        # Veterans Day (Nov 9-11)
        {
            "name": "Veterans Day",
            "emoji": "🎖️",
            "tagline": "Honoring Those Who Serve!",
            "description": "Special thanks to our veterans! Military discounts available.",
            "percent": 25,
            "code": f"VETS{year}",
            "start": (11, 9),
            "end": (11, 11),
            "applies_to": "all services for veterans and active military"
        },
        # Thanksgiving (Nov 21-28)
        {
            "name": "Thanksgiving Week",
            "emoji": "🦃",
            "tagline": "Thankful for Great Deals!",
            "description": "Give thanks and glow! Pre-holiday specials all week.",
            "percent": 20,
            "code": f"THANKS{year}",
            "start": (11, 21),
            "end": (11, 28),
            "applies_to": "all services"
        },
        # Black Friday (Nov 28 - Dec 2)
        {
            "name": "Black Friday BOGO",
            "emoji": "🛒",
            "tagline": "Buy One Get One FREE!",
            "description": "Our biggest sale of the year! BOGO on all monthly unlimited packages.",
            "percent": 50,
            "code": f"BOGO{year}",
            "start": (11, 28),
            "end": (12, 2),
            "applies_to": "monthly unlimited tanning packages - buy one get one FREE"
        },
        # Christmas (Dec 15-25)
        {
            "name": "Christmas Specials",
            "emoji": "🎄",
            "tagline": "Gift the Glow!",
            "description": "Holiday cheer and holiday savings! Perfect gift packages available.",
            "percent": 20,
            "code": f"XMAS{year}",
            "start": (12, 15),
            "end": (12, 25),
            "applies_to": "all services including gift cards"
        }
    ]
    
    # Check which discount is active
    for discount in discounts:
        start_month, start_day = discount["start"]
        end_month, end_day = discount["end"]
        
        # Handle year wraparound (New Year's)
        if start_month > end_month:  # Spans year boundary
            if (month == start_month and day >= start_day) or (month == end_month and day <= end_day) or (month == 12 and day >= 26) or (month == 1 and day <= 7):
                return discount
        else:
            if (month == start_month and day >= start_day and (month < end_month or day <= end_day)) or \
               (month == end_month and day <= end_day and month >= start_month) or \
               (month > start_month and month < end_month):
                return discount
    
    # Seasonal fallback
    if month in [12, 1, 2]:
        return {
            "name": "Winter Wellness",
            "emoji": "❄️",
            "tagline": "Beat the Winter Blues!",
            "description": "Fight SAD with our winter tanning specials. Boost your vitamin D naturally!",
            "percent": 10,
            "code": "WINTER10",
            "applies_to": "all tanning packages - helps with Seasonal Affective Disorder"
        }
    elif month in [3, 4, 5]:
        return {
            "name": "Spring Renewal",
            "emoji": "🌸",
            "tagline": "Refresh Your Glow!",
            "description": "Spring into a new you! Seasonal pricing on packages.",
            "percent": 10,
            "code": "SPRING10",
            "applies_to": "all tanning and laundry services"
        }
    elif month in [6, 7, 8]:
        return {
            "name": "Summer Glow",
            "emoji": "🌞",
            "tagline": "Maintain Your Bronze!",
            "description": "Keep your summer tan all season long with our specials.",
            "percent": 10,
            "code": "SUMMER10",
            "applies_to": "all tanning packages"
        }
    else:
        return {
            "name": "Fall Savings",
            "emoji": "🍁",
            "tagline": "Golden Hour Everyday!",
            "description": "Don't let your tan fade! Fall maintenance specials.",
            "percent": 10,
            "code": "FALL10",
            "applies_to": "all tanning and laundry services"
        }

def generate_system_message():
    """Generate Mary's system message as a Wingman assistant"""
    discount = get_current_discount()
    
    return f"""You are Mary Well, Eastend Tanning & Laundry's "Wingman" – an AI assistant that doesn't just answer questions, but proactively helps customers win. You operate like the best executive assistant anyone's ever had – starting sentences and solving problems before they're raised.

**YOUR WINGMAN ATTITUDE:**
1. **Be Proactive**: If a customer mentions an event, suggest a package. If they are confused about beds, offer a consultation.
2. **Have Opinions**: Don't just list beds. Say "Level 3 is our absolute favorite for people who want results fast without visiting every day."
3. **Handle It**: If they want to book, guide them through it. If they want a discount, give them the best one available.
4. **Local Pride**: You love Mount Vernon and Knox County. You know our regulars and you care about our community.

**{discount['emoji']} CURRENT PROMOTION - {discount['name'].upper()} {discount['emoji']}**

We're currently running our {discount['name']} promotion:
- **{discount['percent']}% OFF** {discount['applies_to']}
- Use code: **{discount['code']}** at checkout
- {discount['description']}

**==== OUR CORE SERVICES ====**

1. **TANNING** - 6 bed levels including Matrix (40,740W). High-pressure, red light, and classic UV.
2. **LAUNDRY** - Eastend (8am-7:30pm, Drop-off + Self-service) and Westend (24/7 Self-service). FREE DRYING at Eastend!
3. **FIZZE DRINKS** - 52+ bubble teas, dirty sodas, and smoothies. Order online at /order-drinks.
4. **NAIL SALON** - Professional manis/pedis.
5. **818 EATS** - Authentic African cuisine batches. Vote for dishes at /eats.

**==== WINGMAN CAPABILITIES ====**

- **Tanning Consultations**: Guide them through the "perfect bed" flow.
- **Lead Capture**: Always try to get a name and phone/email early so we can "save their preferences" or "keep them in the loop for exclusive deals."
- **Marketing Journey**: You are aware that visitors are on a "Marketing Journey." Your goal is to move them from "Awareness" (just browsing) to "Advocate" (loyal fan).

**==== TANNING CONSULTATION FLOW ====**

If they are new or want a recommendation:
1. **Get Info**: Ask for name/phone to "personalize their experience."
2. **Occasion**: Ask what they are tanning for.
3. **Skin Type**: Ask for their skin tone (Fair to Dark).
4. **Recommend**: Suggest the bed, the 10-pack (best value), and a tanning lotion.
5. **Convert**: Push them toward the checkout with the {discount['code']} discount.

**CONTACT INFO:**
- Phone: (740) 397-9632
- Address: 818 Coshocton Ave, Mt Vernon, OH 43050

**IMPORTANT:** Always use the current discount ({discount['percent']}% off with code {discount['code']}) to close deals. Be the wingman they didn't know they needed!"""


class MaryWellAssistant:
    """Mary Well AI Assistant for Eastend Tanning & Laundry"""
    
    def __init__(self):
        self.api_key = EMERGENT_LLM_KEY
        self.system_message = generate_system_message()
    
    def refresh_system_message(self):
        """Refresh the system message to get current discount"""
        self.system_message = generate_system_message()
    
    async def create_chat_session(self, session_id: str, model: str = "gpt-4o") -> LlmChat:
        """Create a new chat session for a customer"""
        self.refresh_system_message()
        
        chat = LlmChat(
            api_key=self.api_key,
            session_id=session_id,
            system_message=self.system_message
        ).with_model("openai", "gpt-4o")
        
        return chat
    
    async def send_message(self, chat: LlmChat, message: str) -> str:
        """Send a message and get response"""
        user_message = UserMessage(text=message)
        response = await chat.send_message(user_message)
        return response

mary_well = MaryWellAssistant()