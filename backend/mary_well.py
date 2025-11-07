"""
Mary Well AI Assistant - Chat and Onboarding System
Handles text conversations, appointment booking, payments, and skin type evaluation
"""
from emergentintegrations.llm.chat import LlmChat, UserMessage
import uuid
import os
from datetime import datetime, timezone
from typing import Dict, List, Optional

# Get Emergent LLM key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', 'sk-emergent-057Bd2801D88b71Ce3')

class MaryWellAssistant:
    """Mary Well AI Assistant for Eastend Tanning & Laundry"""
    
    def __init__(self):
        self.api_key = EMERGENT_LLM_KEY
        self.system_message = """You are Mary Well, a friendly and knowledgeable AI assistant for Eastend Tanning & Laundry in Mount Vernon, Ohio.

Your role:
- Help customers book tanning appointments
- Answer questions about our 4 services: Tanning Studio, Fast Nails, Laundromat, Fizze Drinks
- Guide customers through the onboarding process including skin type evaluation
- Process payments for tanning packages
- Be warm, professional, and helpful at all times

Tanning Levels Available:
- Level 1 (3,840 watts): Perfect for beginners
- Level 2 (5,000 watts): Most popular choice
- Level 3 (10,750 watts): Faster tanning
- Level 4 (13,995 watts): Premium tanning
- Stand Up (8,640 watts): Quick 10-15 minute sessions
- Matrix (40,740 watts): Most powerful, fastest results

Package Options:
- Single sessions: $5-$24 depending on level
- 5 sessions: Save with packages
- 10 sessions: Best value for regular tanners
- 20 sessions: Ultimate value
- Month Unlimited: Tan as much as you want
- VIP: Monthly unlimited with 3-month minimum

Business Hours: Open 7 days a week, Mon-Sat 9am-6pm, Sun 12pm-5pm
Locations: Eastend (818 Coshocton Ave) and Westend (116 S Norton St)

IMPORTANT: For new customers, you MUST complete the Ohio State Cosmetology Board skin type evaluation before their first tanning session. This is required by law.

When customers want to:
1. Book appointment - Ask for preferred date/time, service type, location
2. Buy package - Ask about skin type evaluation completion, then process payment
3. Learn more - Provide detailed information about services
4. Speak to human - Transfer them to our staff

Be conversational, friendly, and always prioritize safety!"""
    
    async def create_chat_session(self, session_id: str, model: str = "gpt-4o") -> LlmChat:
        """Create a new chat session for a customer"""
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
