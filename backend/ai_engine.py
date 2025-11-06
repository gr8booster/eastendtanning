"""
AI Marketing Engine for Eastend Tanning & Laundry
Uses OpenAI GPT-4 and Anthropic Claude for autonomous marketing decisions
"""
import os
from emergentintegrations.llm.chat import LlmChat, UserMessage
from datetime import datetime, timezone
import json
from typing import List, Dict, Any
import uuid

# Initialize with Emergent LLM key
EMERGENT_LLM_KEY = "sk-emergent-057Bd2801D88b71Ce3"


class AIMarketingEngine:
    """Autonomous AI Marketing Engine"""
    
    def __init__(self):
        self.api_key = EMERGENT_LLM_KEY
    
    async def analyze_business_data(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze business metrics and identify opportunities
        Uses GPT-4 for data analysis
        """
        prompt = f"""You are an expert marketing analyst for Eastend Tanning & Laundry, a local business in Mount Vernon, Ohio with 4 services: Tanning Studio, Fast Nails, Laundromat, and Fizze Drinks.

Current Business Metrics (Last 30 Days):
- Total Visitors: {metrics.get('total_visitors', 0):,}
- Page Views: {metrics.get('page_views', 0):,}
- Total Leads: {metrics.get('total_leads', 0)}
- Total Bookings: {metrics.get('total_bookings', 0)}
- Conversion Rate: {metrics.get('conversion_rate', 0):.2f}%
- Total Revenue: ${metrics.get('total_revenue', 0):,.2f}
- Monthly Goal: $83,333.33 (toward $1M in 12 months)

Service Breakdown:
- Tanning: {metrics.get('tanning_bookings', 0)} bookings, ${metrics.get('revenue_by_service', {}).get('tanning', 0):.2f}
- Nails: {metrics.get('nails_bookings', 0)} bookings, ${metrics.get('revenue_by_service', {}).get('nails', 0):.2f}
- Laundry: {metrics.get('laundry_customers', 0)} customers
- Drinks: {metrics.get('drinks_orders', 0)} orders

Analyze this data and provide:
1. Top 3 growth opportunities
2. Underperforming areas that need attention
3. Service-specific recommendations
4. Revenue optimization strategies

Format as JSON with keys: opportunities, concerns, service_recommendations, revenue_strategies"""

        try:
            # Create a new chat instance for this analysis
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"analysis-{uuid.uuid4()}",
                system_message="You are a data-driven marketing strategist specializing in local service businesses."
            ).with_model("openai", "gpt-4o")
            
            # Send the message
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            # Try to parse JSON response
            try:
                return json.loads(response)
            except:
                return {"analysis": response}
        except Exception as e:
            print(f"Error in GPT-4 analysis: {e}")
            return {"error": str(e)}
    
    async def generate_recommendations(self, analysis: Dict[str, Any], metrics: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generate actionable marketing recommendations
        Uses Claude for creative campaign ideas
        """
        prompt = f"""You are a creative marketing strategist for Eastend Tanning & Laundry in Mount Vernon, Ohio.

Business Analysis:
{json.dumps(analysis, indent=2)}

Current Revenue: ${metrics.get('total_revenue', 0):,.2f}
Monthly Goal: $83,333.33

Generate 3-5 HIGH-IMPACT marketing recommendations to drive revenue and bookings. Each recommendation should include:

1. **title**: Short, action-oriented title
2. **recommendation_type**: One of [marketing, pricing, promotion, content, automation]
3. **priority**: One of [urgent, high, medium, low]
4. **description**: 2-3 sentences explaining the opportunity
5. **suggested_action**: Specific step-by-step action plan
6. **estimated_impact**: Quantified revenue or booking increase estimate
7. **target_service**: Which service(s) this helps (tanning, nails, laundry, drinks, or all)

Focus on:
- Lead generation and conversion
- Social media campaigns (Instagram, Facebook, TikTok)
- Local SEO and Google Business optimization
- Email/SMS marketing automation
- Promotions and package deals
- Content marketing (blog posts, videos)

Return ONLY valid JSON array of recommendations. No markdown, no extra text."""

        try:
            # Create a new chat instance for recommendations
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"recommendations-{uuid.uuid4()}",
                system_message="You are a creative marketing strategist specializing in local service businesses."
            ).with_model("anthropic", "claude-sonnet-4-20250514")
            
            # Send the message
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            # Clean up response and parse JSON
            content = response.strip()
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()
            
            recommendations = json.loads(content)
            
            # Add metadata
            for rec in recommendations:
                rec['ai_model'] = 'claude'
                rec['created_at'] = datetime.now(timezone.utc).isoformat()
                rec['status'] = 'pending'
            
            return recommendations
        except Exception as e:
            print(f"Error in Claude recommendations: {e}")
            return []
    
    async def generate_blog_post(self, topic: str, service: str = "all") -> Dict[str, str]:
        """
        Generate SEO-optimized blog post
        Uses GPT-4 for content creation
        """
        prompt = f"""Write a comprehensive, SEO-optimized blog post for Eastend Tanning & Laundry's website.

Topic: {topic}
Target Service: {service}
Target Audience: Mount Vernon, Ohio residents looking for {service} services

Requirements:
- 800-1200 words
- SEO-optimized with keywords for "Mount Vernon Ohio {service}"
- Include H2 and H3 headings
- Engaging, conversational tone
- Include call-to-action to book/visit
- Local references to Mount Vernon
- Helpful, educational content that builds trust

Format as JSON with keys:
- title: SEO-friendly title
- meta_description: 150-160 character meta description
- content: Full blog post in markdown format
- keywords: Array of 5-7 SEO keywords
- cta: Call-to-action text"""

        try:
            # Create a new chat instance for blog generation
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"blog-{uuid.uuid4()}",
                system_message="You are an expert content writer specializing in local service business blogs."
            ).with_model("openai", "gpt-4o")
            
            # Send the message
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            try:
                return json.loads(response)
            except:
                return {
                    "title": topic,
                    "content": response,
                    "meta_description": "",
                    "keywords": [],
                    "cta": "Book your appointment today!"
                }
        except Exception as e:
            print(f"Error generating blog post: {e}")
            return {"error": str(e)}
    
    async def generate_social_media_content(self, campaign_type: str, service: str) -> List[Dict[str, str]]:
        """
        Generate social media posts for campaigns
        Uses Claude for creative content
        """
        prompt = f"""Create 5 engaging social media posts for Eastend Tanning & Laundry's {service} service.

Campaign Type: {campaign_type}
Platform: Facebook & Instagram
Location: Mount Vernon, Ohio

For each post, provide:
- platform: "facebook" or "instagram"
- post_text: Engaging caption (max 150 characters for Instagram, 200 for Facebook)
- hashtags: 5-7 relevant hashtags
- call_to_action: What action we want users to take
- image_suggestion: Description of ideal accompanying image

Make posts:
- Engaging and authentic
- Include local Mount Vernon references
- Have clear calls-to-action (book, call, visit)
- Use emojis appropriately
- Focus on benefits and results

Return as JSON array."""

        try:
            # Create a new chat instance for social media generation
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"social-{uuid.uuid4()}",
                system_message="You are a creative social media content creator for local businesses."
            ).with_model("anthropic", "claude-sonnet-4-20250514")
            
            # Send the message
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            content = response.strip()
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()
            
            return json.loads(content)
        except Exception as e:
            print(f"Error generating social content: {e}")
            return []
    
    async def generate_email_campaign(self, audience: str, offer: str, service: str) -> Dict[str, str]:
        """
        Generate email marketing campaign
        Uses GPT-4 for persuasive copy
        """
        prompt = f"""Create an email marketing campaign for Eastend Tanning & Laundry.

Audience: {audience}
Offer: {offer}
Service: {service}

Create:
- subject_line: Compelling subject line (max 50 chars)
- preview_text: Preview text visible in inbox
- headline: Email headline
- body_html: Full HTML email body (use simple inline styles)
- cta_button_text: Call-to-action button text
- cta_url: Where CTA should link

Make it:
- Persuasive and benefit-focused
- Include social proof
- Create urgency
- Have clear CTA
- Mobile-friendly

Return as JSON."""

        try:
            # Create a new chat instance for email generation
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"email-{uuid.uuid4()}",
                system_message="You are a persuasive email copywriter for service businesses."
            ).with_model("openai", "gpt-4o")
            
            # Send the message
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            try:
                return json.loads(response)
            except:
                return {"error": "Failed to parse response"}
        except Exception as e:
            print(f"Error generating email campaign: {e}")
            return {"error": str(e)}


# Initialize global AI engine
ai_engine = AIMarketingEngine()
