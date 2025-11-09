"""
AI Engine API endpoints
Provides manual and automated AI marketing functions
"""
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import uuid

from ai_engine import ai_engine
from routes import db
from rate_limiter import rate_limit

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
@rate_limit(max_requests=5, window_seconds=300)
async def run_business_analysis(request: Request, analysis_request: AnalysisRequest):
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
@rate_limit(max_requests=10, window_seconds=300)
async def generate_ai_recommendations(request: Request, rec_request: RecommendationGenerateRequest):
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
@rate_limit(max_requests=10, window_seconds=300)
async def generate_blog_content(request: Request, blog_request: BlogPostRequest):
    """
    Generate SEO-optimized blog post
    Uses GPT-4 for content creation
    """
    try:
        blog_post = await ai_engine.generate_blog_post(request.topic, request.service)

        # Normalize response (flatten fields)
        if isinstance(blog_post, dict):
            title = blog_post.get("title") or request.topic
            meta_description = blog_post.get("meta_description") or ""
            content = blog_post.get("content") or ""
            # Strip code fences if present
            if isinstance(content, str) and content.strip().startswith("```"):
                # remove leading and trailing fenced blocks
                content = content.strip()
                if content.startswith("```json"):
                    content = content[7:].strip()
                if content.startswith("```"):
                    content = content[3:].strip()
                if content.endswith("```"):
                    content = content[:-3].strip()
            keywords = blog_post.get("keywords") or []
            cta = blog_post.get("cta") or "Book your appointment today!"
        else:
            title = request.topic
            meta_description = ""
            content = str(blog_post)
            keywords = []
            cta = "Book your appointment today!"

        blog_doc = {
            "id": str(uuid.uuid4()),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "topic": request.topic,
            "service": request.service,
            "title": title,
            "meta_description": meta_description,
            "content": content,
            "keywords": keywords,
            "cta": cta,
            "status": "published",
            "ai_model": "gpt-4"
        }
        await db.blog_posts.insert_one(blog_doc)

        return {"status": "success", "blog_post": blog_doc, "blog_id": blog_doc["id"]}
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



@ai_router.get("/content/blog")
async def get_blog_posts(limit: int = 20):
    """Get all blog posts (normalized)"""
    try:
        cursor = db.blog_posts.find({}).sort("created_at", -1).limit(limit)
        posts = []
        async for doc in cursor:
            doc.pop('_id', None)
            # If legacy shape (content is object), flatten
            if isinstance(doc.get('content'), dict):
                content_obj = doc['content']
                doc['title'] = doc.get('title') or content_obj.get('title') or doc.get('topic')
                doc['meta_description'] = doc.get('meta_description') or content_obj.get('meta_description') or ""
                raw_content = content_obj.get('content') or ""
                # Strip code fences
                if isinstance(raw_content, str) and raw_content.strip().startswith('```'):
                    raw = raw_content.strip()
                    if raw.startswith('```json'):
                        raw = raw[7:].strip()
                    if raw.startswith('```'):
                        raw = raw[3:].strip()
                    if raw.endswith('```'):
                        raw = raw[:-3].strip()
                    doc['content'] = raw
                else:
                    doc['content'] = raw_content
                doc['keywords'] = doc.get('keywords') or content_obj.get('keywords') or []
                doc['cta'] = doc.get('cta') or content_obj.get('cta') or "Book your appointment today!"
            # Ensure created_at is present
            doc['created_at'] = doc.get('created_at', datetime.now(timezone.utc).isoformat())
            posts.append(doc)
        return posts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch blog posts: {str(e)}")


@ai_router.get("/content/blog/{post_id}")
async def get_blog_post(post_id: str):
    """Get a single blog post by ID (normalized)"""
    try:
        post = await db.blog_posts.find_one({"id": post_id})
        if not post:
            raise HTTPException(status_code=404, detail="Blog post not found")
        post.pop('_id', None)
        # Normalize legacy shape
        if isinstance(post.get('content'), dict):
            content_obj = post['content']
            post['title'] = post.get('title') or content_obj.get('title') or post.get('topic')
            post['meta_description'] = post.get('meta_description') or content_obj.get('meta_description') or ""
            raw_content = content_obj.get('content') or ""
            if isinstance(raw_content, str) and raw_content.strip().startswith('```'):
                raw = raw_content.strip()
                if raw.startswith('```json'):
                    raw = raw[7:].strip()
                if raw.startswith('```'):
                    raw = raw[3:].strip()
                if raw.endswith('```'):
                    raw = raw[:-3].strip()
                post['content'] = raw
            else:
                post['content'] = raw_content
            post['keywords'] = post.get('keywords') or content_obj.get('keywords') or []
            post['cta'] = post.get('cta') or content_obj.get('cta') or "Book your appointment today!"
        post['created_at'] = post.get('created_at', datetime.now(timezone.utc).isoformat())
        return post
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch blog post: {str(e)}")


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
