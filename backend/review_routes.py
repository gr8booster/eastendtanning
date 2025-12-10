"""
Customer review management system with AI-powered issue resolution
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid
import os

router = APIRouter()

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(MONGO_URL)
db = client['eastend_db']
reviews_collection = db['customer_reviews']

class ReviewSubmission(BaseModel):
    customer_name: str
    customer_email: EmailStr
    rating: int  # 1-5
    review_text: str
    business_location: str  # 'eastend', 'westend', 'fizze', 'nails', 'foodtruck'
    
class AIResponse(BaseModel):
    review_id: str
    ai_response: str
    
class ReviewUpdate(BaseModel):
    review_id: str
    new_rating: int
    updated_text: str

@router.post("/api/reviews/submit")
async def submit_review(review: ReviewSubmission):
    """
    Submit a customer review
    - 5-star reviews are auto-published
    - <5-star reviews go to AI resolution queue
    """
    try:
        review_id = str(uuid.uuid4())
        
        review_doc = {
            "review_id": review_id,
            "customer_name": review.customer_name,
            "customer_email": review.customer_email,
            "rating": review.rating,
            "review_text": review.review_text,
            "business_location": review.business_location,
            "created_at": datetime.now(timezone.utc),
            "status": "published" if review.rating == 5 else "pending_resolution",
            "public": review.rating == 5,
            "ai_conversation": [],
            "resolved": False,
            "updated_rating": None
        }
        
        await reviews_collection.insert_one(review_doc)
        
        # If less than 5 stars, trigger AI response
        if review.rating < 5:
            ai_response = await generate_ai_response(review)
            
            await reviews_collection.update_one(
                {"review_id": review_id},
                {"$push": {"ai_conversation": {
                    "timestamp": datetime.now(timezone.utc),
                    "role": "ai",
                    "message": ai_response
                }}}
            )
            
            return {
                "success": True,
                "review_id": review_id,
                "message": "Thank you for your feedback. We'd like to address your concerns.",
                "ai_response": ai_response,
                "requires_response": True
            }
        
        return {
            "success": True,
            "review_id": review_id,
            "message": "Thank you for your 5-star review! It's now live on our website.",
            "public": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit review: {str(e)}")

@router.post("/api/reviews/respond")
async def customer_responds_to_ai(response: AIResponse):
    """
    Customer responds to AI's solution offer
    """
    try:
        review = await reviews_collection.find_one({"review_id": response.review_id})
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
        
        # Add customer response to conversation
        await reviews_collection.update_one(
            {"review_id": response.review_id},
            {"$push": {"ai_conversation": {
                "timestamp": datetime.now(timezone.utc),
                "role": "customer",
                "message": response.ai_response
            }}}
        )
        
        # Generate follow-up AI response
        follow_up = await generate_followup_response(review, response.ai_response)
        
        await reviews_collection.update_one(
            {"review_id": response.review_id},
            {"$push": {"ai_conversation": {
                "timestamp": datetime.now(timezone.utc),
                "role": "ai",
                "message": follow_up
            }}}
        )
        
        return {
            "success": True,
            "ai_response": follow_up
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process response: {str(e)}")

@router.post("/api/reviews/update")
async def update_review(update: ReviewUpdate):
    """
    Customer updates their review after issue resolution
    """
    try:
        result = await reviews_collection.update_one(
            {"review_id": update.review_id},
            {"$set": {
                "updated_rating": update.new_rating,
                "updated_text": update.updated_text,
                "resolved": True,
                "resolved_at": datetime.now(timezone.utc),
                "public": update.new_rating == 5,
                "status": "published" if update.new_rating == 5 else "resolved_low"
            }}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Review not found")
        
        return {
            "success": True,
            "message": "Thank you for updating your review!" if update.new_rating == 5 else "Thank you for your feedback.",
            "public": update.new_rating == 5
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update review: {str(e)}")

@router.get("/api/reviews/public")
async def get_public_reviews(business_location: str = None, limit: int = 10):
    """
    Get published 5-star reviews for display
    """
    try:
        query = {"public": True}
        if business_location:
            query["business_location"] = business_location
        
        cursor = reviews_collection.find(query).sort("created_at", -1).limit(limit)
        reviews = await cursor.to_list(length=limit)
        
        # Format for frontend
        formatted_reviews = []
        for review in reviews:
            formatted_reviews.append({
                "review_id": review["review_id"],
                "customer_name": review["customer_name"],
                "rating": review.get("updated_rating") or review["rating"],
                "review_text": review.get("updated_text") or review["review_text"],
                "business_location": review["business_location"],
                "created_at": review["created_at"].isoformat(),
                "was_updated": review.get("resolved", False)
            })
        
        return {"reviews": formatted_reviews}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch reviews: {str(e)}")

@router.get("/api/reviews/pending")
async def get_pending_reviews():
    """
    Get reviews pending resolution (for admin dashboard)
    """
    try:
        cursor = reviews_collection.find({
            "status": {"$in": ["pending_resolution", "in_conversation"]},
            "resolved": False
        }).sort("created_at", -1)
        
        reviews = await cursor.to_list(length=100)
        
        formatted_reviews = []
        for review in reviews:
            formatted_reviews.append({
                "review_id": review["review_id"],
                "customer_name": review["customer_name"],
                "customer_email": review["customer_email"],
                "rating": review["rating"],
                "review_text": review["review_text"],
                "business_location": review["business_location"],
                "created_at": review["created_at"].isoformat(),
                "ai_conversation": review.get("ai_conversation", []),
                "last_updated": review.get("ai_conversation", [{}])[-1].get("timestamp", review["created_at"]).isoformat() if review.get("ai_conversation") else review["created_at"].isoformat()
            })
        
        return {"pending_reviews": formatted_reviews}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch pending reviews: {str(e)}")

async def generate_ai_response(review: ReviewSubmission) -> str:
    """
    Generate AI response to address customer concerns
    """
    try:
        from openai import AsyncOpenAI
        
        EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
        if not EMERGENT_LLM_KEY:
            return "Thank you for your feedback. We apologize for any inconvenience. Our team will reach out to you shortly to resolve this issue."
        
        client = AsyncOpenAI(
            api_key=EMERGENT_LLM_KEY,
            base_url="https://llm.emergent.host/v1"
        )
        
        prompt = f"""You are a customer service AI for Eastend Tanning & Laundry in Mt Vernon, Ohio. A customer left a {review.rating}-star review.

Review: "{review.review_text}"
Business Location: {review.business_location}

Your task:
1. Acknowledge their specific concern with empathy
2. Apologize sincerely
3. Offer a concrete solution or compensation (discount, free service, manager callback)
4. Keep response under 100 words
5. Be warm, professional, and solution-focused

Generate a response:"""
        
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"AI response error: {e}")
        return "Thank you for your feedback. We sincerely apologize for not meeting your expectations. We'd love to make this right. Please reply with what would help resolve your concern, and we'll do our best to accommodate."

async def generate_followup_response(review: dict, customer_message: str) -> str:
    """
    Generate AI follow-up response
    """
    try:
        from openai import AsyncOpenAI
        
        EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
        if not EMERGENT_LLM_KEY:
            return "Thank you for your response. We're working on resolving this for you. Would you consider updating your review once we've addressed your concerns?"
        
        client = AsyncOpenAI(
            api_key=EMERGENT_LLM_KEY,
            base_url="https://llm.emergent.host/v1"
        )
        
        conversation_history = "\n".join([
            f"{msg['role']}: {msg['message']}" 
            for msg in review.get("ai_conversation", [])
        ])
        
        prompt = f"""Continue this customer service conversation:

Original Review ({review['rating']} stars): "{review['review_text']}"

Conversation so far:
{conversation_history}

Customer's latest message: "{customer_message}"

If the customer seems satisfied, ask: "We're glad we could help! Would you consider updating your review to reflect your improved experience?"

If more help is needed, offer additional solutions. Keep under 80 words.

Response:"""
        
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"AI follow-up error: {e}")
        return "Thank you for your response. We're committed to resolving this. Once we've addressed your concerns, would you be willing to update your review?"
