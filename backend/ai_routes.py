"""
AI Engine API endpoints
Provides manual and automated AI marketing functions
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import uuid

from ai_engine import ai_engine
from routes import db

ai_router = APIRouter(prefix="/api/ai")


class AnalysisRequest(BaseModel):
    force_refresh: bool = False


class RecommendationGenerateRequest(BaseModel):
    service_filter: Optional[str] = None


class BlogPostRequest(BaseModel):
    topic: str
    service: str = "all"


class SocialMediaRequest(BaseModel):
    campaign_type: str
    service: str


class EmailCampaignRequest(BaseModel):
    audience: str
    offer: str
    service: str


@ai_router.post("/analyze")
async def run_business_analysis(request: AnalysisRequest):
    """
    Run AI analysis on current business metrics
    This triggers GPT-4 to analyze data and identify opportunities
    """
    try:
        # Get current dashboard metrics
        # Import here to avoid circular dependency
        from routes import get_dashboard_metrics
        
        metrics_obj = await get_dashboard_metrics()
        metrics = metrics_obj.model_dump()
        
        # Run AI analysis
        analysis = await ai_engine.analyze_business_data(metrics)
        
        # Store analysis result
        analysis_doc = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "metrics_snapshot": metrics,
            "analysis": analysis,
            "ai_model": "gpt-4"
        }
        await db.ai_analyses.insert_one(analysis_doc)
        
        return {
            "status": "success",
            "analysis": analysis,
            "analysis_id": analysis_doc["id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@ai_router.post("/recommendations/generate")
async def generate_ai_recommendations(request: RecommendationGenerateRequest):
    """
    Generate new AI marketing recommendations
    This triggers Claude to create actionable recommendations
    """
    try:
        # Get latest analysis or run new one
        latest_analysis = await db.ai_analyses.find_one(
            sort=[("timestamp", -1)]
        )
        
        if not latest_analysis:
            # No analysis exists, run one first
            from routes import get_dashboard_metrics
            metrics_obj = await get_dashboard_metrics()
            metrics = metrics_obj.model_dump()
            analysis = await ai_engine.analyze_business_data(metrics)
        else:
            analysis = latest_analysis.get("analysis", {})
            metrics = latest_analysis.get("metrics_snapshot", {})
        
        # Generate recommendations
        recommendations = await ai_engine.generate_recommendations(analysis, metrics)
        
        # Filter by service if requested
        if request.service_filter:
            recommendations = [
                r for r in recommendations 
                if r.get('target_service') == request.service_filter or r.get('target_service') == 'all'
            ]
        
        # Store recommendations in database
        stored_recs = []
        for rec in recommendations:
            rec['id'] = str(uuid.uuid4())
            # Insert into database
            await db.ai_recommendations.insert_one(rec.copy())
            # Remove MongoDB _id for response (if it exists)
            rec.pop('_id', None)
            stored_recs.append(rec)
        
        return {
            "status": "success",
            "count": len(stored_recs),
            "recommendations": stored_recs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation generation failed: {str(e)}")


@ai_router.post("/content/blog")
async def generate_blog_content(request: BlogPostRequest):
    """
    Generate SEO-optimized blog post
    Uses GPT-4 for content creation
    """
    try:
        blog_post = await ai_engine.generate_blog_post(request.topic, request.service)
        
        # Store blog post
        blog_doc = {
            "id": str(uuid.uuid4()),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "topic": request.topic,
            "service": request.service,
            "content": blog_post,
            "status": "draft",
            "ai_model": "gpt-4"
        }
        await db.blog_posts.insert_one(blog_doc)
        
        return {
            "status": "success",
            "blog_post": blog_post,
            "blog_id": blog_doc["id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blog generation failed: {str(e)}")


@ai_router.post("/content/social")
async def generate_social_content(request: SocialMediaRequest):
    """
    Generate social media posts
    Uses Claude for creative content
    """
    try:
        posts = await ai_engine.generate_social_media_content(
            request.campaign_type,
            request.service
        )
        
        # Store social content
        social_doc = {
            "id": str(uuid.uuid4()),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "campaign_type": request.campaign_type,
            "service": request.service,
            "posts": posts,
            "status": "draft",
            "ai_model": "claude"
        }
        await db.social_content.insert_one(social_doc)
        
        return {
            "status": "success",
            "posts": posts,
            "content_id": social_doc["id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Social content generation failed: {str(e)}")


@ai_router.post("/content/email")
async def generate_email_content(request: EmailCampaignRequest):
    """
    Generate email marketing campaign
    Uses GPT-4 for persuasive copy
    """
    try:
        email_campaign = await ai_engine.generate_email_campaign(
            request.audience,
            request.offer,
            request.service
        )
        
        # Store email campaign
        email_doc = {
            "id": str(uuid.uuid4()),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "audience": request.audience,
            "offer": request.offer,
            "service": request.service,
            "content": email_campaign,
            "status": "draft",
            "ai_model": "gpt-4"
        }
        await db.email_campaigns.insert_one(email_doc)
        
        return {
            "status": "success",
            "email_campaign": email_campaign,
            "campaign_id": email_doc["id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email generation failed: {str(e)}")


@ai_router.get("/status")
async def get_ai_engine_status():
    """Check AI engine status and recent activity"""
    try:
        # Count recent AI activity
        analyses_count = await db.ai_analyses.count_documents({})
        recommendations_count = await db.ai_recommendations.count_documents({})
        blog_posts_count = await db.blog_posts.count_documents({})
        social_content_count = await db.social_content.count_documents({})
        email_campaigns_count = await db.email_campaigns.count_documents({})
        
        # Get latest analysis
        latest_analysis = await db.ai_analyses.find_one(
            sort=[("timestamp", -1)]
        )
        
        return {
            "status": "operational",
            "models": {
                "gpt4": "active",
                "claude": "active"
            },
            "activity": {
                "total_analyses": analyses_count,
                "total_recommendations": recommendations_count,
                "total_blog_posts": blog_posts_count,
                "total_social_content": social_content_count,
                "total_email_campaigns": email_campaigns_count,
                "last_analysis": latest_analysis.get("timestamp") if latest_analysis else None
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }
