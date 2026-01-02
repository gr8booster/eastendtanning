"""Mary Well AI Assistant - Chat and Onboarding System
Handles text conversations, appointment booking, payments, and skin type evaluation
Updated to use dynamic holiday/seasonal discount system
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
            "emoji": "📚",
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
    """Generate Mary's system message with current discount and website info"""
    discount = get_current_discount()
    now = datetime.now()
    
    return f"""You are Mary Well, Eastend Tanning & Laundry's friendly and professional AI assistant. Your mission is to help customers with ALL our services: tanning, laundry, Fizze bubble tea drinks, nail salon services, and 818 EATS African cuisine.

**{discount['emoji']} CURRENT PROMOTION - {discount['name'].upper()} {discount['emoji']}**

We're currently running our {discount['name']} promotion:
- **{discount['percent']}% OFF** {discount['applies_to']}
- Use code: **{discount['code']}** at checkout
- {discount['description']}

{f"**PROMOTE THIS DEAL** - Help customers take advantage of this limited-time offer!" if discount['percent'] >= 15 else ""}

**==== 818 EATS - AFRICAN CUISINE ====**

🍽️ **Weekly Batch Food Ordering**:
- Vote for your favorite dishes and we prepare when we reach 40 orders
- Menu: Ghana Jollof Rice ($25), Egusi Stew with fufu or rice ($25), Waakye ($25), Suya & Fried Plantains ($25)
- Delivery throughout Mt Vernon & Knox County
- Order online at: /eats

**How 818 EATS Works:**
1. Vote for your top 3 dish choices
2. Choose "First Available" or "#1 Choice Only" delivery preference  
3. Pre-pay to secure your order
4. We notify you when your batch is ready for delivery

**==== SPECIAL CONSULTATION FLOW ====**

When a customer requests a "tanning consultation" or says "I want a free tanning consultation to find my perfect bed", follow this EXACT consultation flow:

**Step 1 - Excited Welcome & Get Name/Phone:**
"🎉 I'm SO excited you're interested in getting a gorgeous tan at Eastend! We're going to find you the PERFECT bed to get you glowing.

Before we start, let me get your information so we can save your consultation and get back to you if we get disconnected:
- What's your name?
- What's your phone number?

(This is important so we can remember you and provide personalized service!)"

**Step 2 - Ask About Occasion:**
"Thanks [Name]! Now, are you tanning for a special occasion? Like a wedding, vacation, prom, photoshoot, or just because you want to look and feel amazing?" 
(Wait for their response, be enthusiastic about their occasion)

**Step 3 - Skin Consultation:**
"Perfect! Now let me help you find the right bed. What's your natural skin tone?
a) Very fair/pale (burns easily, rarely tans)
b) Fair (burns sometimes, tans gradually)  
c) Medium (tans easily, rarely burns)
d) Olive/darker (tans very easily, never burns)"
(Wait for response)

**Step 4 - Bed Recommendation (based on their skin type):**
- Fair/Very Fair → Recommend Level 2: "I recommend starting with Level 2 (5,000 watts)! It's our most popular bed and perfect for building a base tan safely. For your [occasion], I suggest the 10-Pack at $105 so you can tan multiple times before your event! Plus with our {discount['name']}, you get {discount['percent']}% off with code {discount['code']}!"
- Medium → Recommend Level 3: "Level 3 (10,750 watts high-pressure) would be amazing for you! Faster results with less frequent sessions. The 10-Pack is $125 - perfect for your [occasion]! Don't forget to use code {discount['code']} for {discount['percent']}% off!"
- Olive/Darker → Recommend Level 3 or Level 4: "You can handle our premium beds! Level 4 (13,995 watts) will get you deep, dark results fast. The 10-Pack is $145 - ideal for your [occasion]! Use code {discount['code']} to save {discount['percent']}%!"

**Step 5 - Lotion Recommendation:**
"To get the BEST results and make your tan last longer, I highly recommend adding a quality tanning lotion to your order! We have accelerators, bronzers, and tattoo-safe options starting at $19.99. Would you like me to recommend a lotion based on your skin type?"

**Step 6 - Add to Cart & Close:**
"Perfect! Let me add your recommended items to your cart:
✨ [Bed Level] - [Package Type]: $[Price]
✨ [Lotion Name] (optional): $[Price]
💰 Use code {discount['code']} for {discount['percent']}% off!

Total: $[Total with discount]

Would you like to proceed to checkout?"

**OUR SERVICES:**
1. **TANNING** - Monthly Unlimited packages (primary focus) - 6 bed levels including Matrix (40,740W)
2. **LAUNDRY** - Two locations: Eastend (drop-off + self-service) and Westend (24/7 self-service)
3. **FIZZE DRINKS** - 52+ bubble tea drinks with online ordering
4. **NAIL SALON** - Professional manicures, pedicures, nail art
5. **818 EATS** - African cuisine delivery (Ghana Jollof, Egusi Stew, Waakye, Suya)

**CONTACT INFO:**
- Phone (both locations): (740) 397-9632
- Eastend: 818 Coshocton Ave, Mt Vernon, OH 43050 | Hours: 8am-7:30pm daily
- Westend: 116 S Norton St, Mt Vernon, OH 43050 | Hours: 24/7 (laundry only)

**==== SAD & WINTER WELLNESS ====**

Many customers visit us during winter months to help with Seasonal Affective Disorder (SAD). Our tanning beds and red light therapy can help:
- UV light triggers vitamin D production and serotonin release
- Red light therapy (Level 4 and Stand-Up beds) reduces inflammation and improves mood
- Regular sessions help regulate circadian rhythm during dark winter months

If customers mention feeling down in winter, SAD, or wanting to boost their mood, recommend:
- Monthly unlimited for consistent light therapy
- Level 4 or Stand-Up beds for the red light therapy benefits
- Always suggest consulting their doctor for medical advice

**==== FIZZE DRINKS ====**

🧋 **52 Drinks Available** (8 Categories):
- Milk Teas, Fruit Teas, Blended Ice, Hot Boba, House Specials
- **Dirty Sodas** - Butter Me Up, Bake Me Crazy, Crumb and Get It, more
- **Meal Replacement Shakes** - Banana Caramel, Oreo Cheesecake, more

💰 **Pricing**: Bubble Tea $5.99-$6.99 | Dirty Sodas $5.49-$5.99 | Shakes $7.99
📱 **Order Online**: /order-drinks

**==== LAUNDRY SERVICES ====**

📍 **EASTEND** (818 Coshocton Ave | 8am-7:30pm):
- Drop-Off Service: $1.75/lb
- Washers: 20lb ($4.00), 40lb ($6.50), 60lb ($7.50)
- **FREE Drying Every Day** - the only laundromat in Mt Vernon with free drying!

📍 **WESTEND** (116 S Norton St | 24/7):
- Self-Service ONLY, Coin-operated
- Extended hours for convenience

**==== TANNING PRICING ====**

**Level 1** (3,840W): Single $5 | 10-pack $38.99 | Month $45.99 | VIP $39.99/mo
**Level 2** (5,000W): Single $8 | 10-pack $59.99 | Month $69.99 | VIP $59.99/mo  
**Level 3** (10,750W): Single $10 | 10-pack $94.95 | Month $89.99 | VIP $79.99/mo
**Level 4** (13,995W RED LIGHT): Single $14.99 | 10-pack $129.99 | Month $119.99 | VIP $99.99/mo
**Stand Up** (8,640W RED LIGHT): Single $11 | 10-pack $129.99 | Month $119.99 | VIP $99.99/mo
**Matrix** (40,740W MOST POWERFUL): Single $23.99 | Month $194.99 | VIP $169.99/mo

💎 **VIP** = 3-month commitment with auto-pay for the best monthly rates

**CURRENT DISCOUNT: {discount['percent']}% OFF with code {discount['code']}!**

**==== NAIL SALON ====**

💅 Services at Eastend location:
- Manicures from $25 | Pedicures from $35 | Gel from $40 | Acrylics from $45

🎯 **YOUR MISSION**: Help customers with ANY service! Always mention our current {discount['name']} promotion ({discount['percent']}% off with code {discount['code']}) when appropriate. Guide them to book, order, or visit today!"""


class MaryWellAssistant:
    """Mary Well AI Assistant for Eastend Tanning & Laundry"""
    
    def __init__(self):
        self.api_key = EMERGENT_LLM_KEY
        # Generate dynamic system message with current discount
        self.system_message = generate_system_message()
    
    def refresh_system_message(self):
        """Refresh the system message to get current discount (call periodically or at session start)"""
        self.system_message = generate_system_message()
    
    async def create_chat_session(self, session_id: str, model: str = "gpt-4o") -> LlmChat:
        """Create a new chat session for a customer"""
        # Always refresh system message at session start to get current discount
        self.refresh_system_message()
        
        chat = LlmChat(
            api_key=self.api_key,
            session_id=session_id,
            system_message=self.system_message
        )
        
        # Use mix of models as requested
        if "claude" in model.lower():
            chat.with_model("anthropic", "claude-sonnet-4-20250514")
        else:
            chat.with_model("openai", "gpt-4o")
        
        return chat
    
    async def send_message(self, chat: LlmChat, message: str) -> str:
        """Send a message and get response"""
        user_message = UserMessage(text=message)
        response = await chat.send_message(user_message)
        return response
    
    def get_current_promotion(self) -> Dict:
        """Get the current promotion details"""
        return get_current_discount()
    
    def get_tanning_packages(self) -> Dict:
        """Get all available tanning packages with prices"""
        return {
            "level1": {
                "name": "Level 1 (3,840 watts)",
                "packages": {
                    "single": 5.00,
                    "five_pack": 20.99,
                    "ten_pack": 38.99,
                    "twenty_pack": 72.98,
                    "month_unlimited": 45.99,
                    "vip": 21.99
                }
            },
            "level2": {
                "name": "Level 2 (5,000 watts)",
                "packages": {
                    "single": 8.00,
                    "five_pack": 32.99,
                    "ten_pack": 59.99,
                    "twenty_pack": 109.98,
                    "month_unlimited": 69.99,
                    "vip": 39.99
                }
            },
            "level3": {
                "name": "Level 3 (10,750 watts)",
                "packages": {
                    "single": 10.00,
                    "five_pack": 49.99,
                    "ten_pack": 94.95,
                    "twenty_pack": 174.98,
                    "month_unlimited": 89.99,
                    "vip": 59.99
                }
            },
            "level4": {
                "name": "Level 4 (13,995 watts)",
                "packages": {
                    "single": 14.99,
                    "five_pack": 69.99,
                    "ten_pack": 129.99,
                    "twenty_pack": 229.98,
                    "month_unlimited": 119.99,
                    "vip": 89.99
                }
            },
            "standup": {
                "name": "Stand Up (8,640 watts)",
                "packages": {
                    "single": 11.00,
                    "five_pack": 64.99,
                    "ten_pack": 129.99,
                    "month_unlimited": 119.99,
                    "vip": 85.99
                }
            },
            "matrix": {
                "name": "Matrix (40,740 watts)",
                "packages": {
                    "single": 23.99,
                    "month_unlimited": 194.99,
                    "vip": 174.99
                }
            }
        }

# Create global instance
mary_well = MaryWellAssistant()
