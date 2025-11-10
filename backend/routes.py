from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
from pathlib import Path

from models import (
    PageView, ConversionEvent,
    Lead, LeadCreate,
    Booking, BookingCreate,
    Campaign, CampaignCreate,
    AIRecommendation,
    DashboardMetrics
)
from auth import verify_token
from roles import Permission, require_permission, require_any_permission

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Get MongoDB client
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# Create router
router = APIRouter(prefix="/api")


# Analytics Endpoints
@router.post("/analytics/pageview")
async def track_pageview(pageview: PageView):
    """Track a page view"""
    pageview_dict = pageview.model_dump()
    pageview_dict['timestamp'] = pageview.timestamp.isoformat()
    await db.pageviews.insert_one(pageview_dict)
    return {"status": "success", "id": pageview.id}


@router.post("/analytics/conversion")
async def track_conversion(conversion: ConversionEvent):
    """Track a conversion event"""
    conversion_dict = conversion.model_dump()
    conversion_dict['timestamp'] = conversion.timestamp.isoformat()
    await db.conversions.insert_one(conversion_dict)
    return {"status": "success", "id": conversion.id}


@router.get("/analytics/stats")
async def get_analytics_stats(days: int = 30):
    """Get analytics statistics for the last N days"""
    start_date = datetime.now(timezone.utc) - timedelta(days=days)
    
    # Count page views
    page_views = await db.pageviews.count_documents({
        "timestamp": {"$gte": start_date.isoformat()}
    })
    
    # Count unique sessions
    unique_sessions = await db.pageviews.distinct("session_id", {
        "timestamp": {"$gte": start_date.isoformat()}
    })
    
    # Count conversions
    conversions = await db.conversions.count_documents({
        "timestamp": {"$gte": start_date.isoformat()}
    })
    
    return {
        "page_views": page_views,
        "unique_sessions": len(unique_sessions),
        "conversions": conversions,
        "conversion_rate": (conversions / len(unique_sessions) * 100) if len(unique_sessions) > 0 else 0
    }


# Lead Endpoints
@router.post("/leads", response_model=Lead)
async def create_lead(lead_input: LeadCreate):
    """Create a new lead"""
    lead = Lead(**lead_input.model_dump())
    lead_dict = lead.model_dump()
    lead_dict['created_at'] = lead.created_at.isoformat()
    lead_dict['updated_at'] = lead.updated_at.isoformat()
    await db.leads.insert_one(lead_dict)
    return lead


@router.get("/leads", response_model=List[Lead])
async def get_leads(
    status: Optional[str] = None, 
    service: Optional[str] = None, 
    limit: int = 50,
    current_user: dict = Depends(require_permission(Permission.LEADS_READ))
):
    """Get leads with optional filters"""
    query = {}
    if status:
        query['status'] = status
    if service:
        query['service_interest'] = service
    
    cursor = db.leads.find(query).sort("created_at", -1).limit(limit)
    leads = []
    async for doc in cursor:
        created_raw = doc.get('created_at')
        updated_raw = doc.get('updated_at')
        if isinstance(created_raw, str):
            try:
                doc['created_at'] = datetime.fromisoformat(created_raw)
            except Exception:
                doc['created_at'] = datetime.now(timezone.utc)
        elif isinstance(created_raw, datetime):
            # ensure tz-aware
            doc['created_at'] = created_raw if created_raw.tzinfo else created_raw.replace(tzinfo=timezone.utc)
        else:
            doc['created_at'] = datetime.now(timezone.utc)

        if isinstance(updated_raw, str):
            try:
                doc['updated_at'] = datetime.fromisoformat(updated_raw)
            except Exception:
                doc['updated_at'] = doc['created_at']
        elif isinstance(updated_raw, datetime):
            doc['updated_at'] = updated_raw if updated_raw.tzinfo else updated_raw.replace(tzinfo=timezone.utc)
        else:
            doc['updated_at'] = doc['created_at']
        leads.append(Lead(**doc))
    return leads


@router.patch("/leads/{lead_id}")
async def update_lead(
    lead_id: str, 
    status: Optional[str] = None, 
    notes: Optional[str] = None,
    current_user: dict = Depends(require_permission(Permission.LEADS_WRITE))
):
    """Update lead status or notes"""
    result = await db.leads.update_one(
        {"id": lead_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"status": "success"}


# Booking Endpoints
@router.post("/bookings", response_model=Booking)
async def create_booking(booking_input: BookingCreate):
    """Create a new booking"""
    booking = Booking(**booking_input.model_dump())
    booking_dict = booking.model_dump()
    booking_dict['booking_date'] = booking.booking_date.isoformat()
    booking_dict['created_at'] = booking.created_at.isoformat()
    await db.bookings.insert_one(booking_dict)
    return booking


@router.get("/bookings", response_model=List[Booking])
async def get_bookings(
    status: Optional[str] = None, 
    service: Optional[str] = None, 
    limit: int = 50,
    current_user: dict = Depends(require_permission(Permission.BOOKINGS_READ))
):
    """Get bookings with optional filters"""
    query = {}
    if service:
        query['service'] = service
    if status:
        query['status'] = status
    
    cursor = db.bookings.find(query).sort("created_at", -1).limit(limit)
    bookings = []
    async for doc in cursor:
        bd_raw = doc.get('booking_date')
        ca_raw = doc.get('created_at')
        if isinstance(bd_raw, str):
            try:
                doc['booking_date'] = datetime.fromisoformat(bd_raw)
            except Exception:
                doc['booking_date'] = datetime.now(timezone.utc)
        elif isinstance(bd_raw, datetime):
            doc['booking_date'] = bd_raw if bd_raw.tzinfo else bd_raw.replace(tzinfo=timezone.utc)
        else:
            doc['booking_date'] = datetime.now(timezone.utc)
        if isinstance(ca_raw, str):
            try:
                doc['created_at'] = datetime.fromisoformat(ca_raw)
            except Exception:
                doc['created_at'] = datetime.now(timezone.utc)
        elif isinstance(ca_raw, datetime):
            doc['created_at'] = ca_raw if ca_raw.tzinfo else ca_raw.replace(tzinfo=timezone.utc)
        else:
            doc['created_at'] = datetime.now(timezone.utc)
        bookings.append(Booking(**doc))
    return bookings


# Campaign Endpoints
@router.post("/campaigns", response_model=Campaign)
async def create_campaign(
    campaign_input: CampaignCreate,
    current_user: dict = Depends(require_permission(Permission.CAMPAIGNS_WRITE))
):
    """Create a new marketing campaign"""
    campaign = Campaign(**campaign_input.model_dump())
    campaign_dict = campaign.model_dump()
    campaign_dict['created_at'] = campaign.created_at.isoformat()
    campaign_dict['updated_at'] = campaign.updated_at.isoformat()
    await db.campaigns.insert_one(campaign_dict)
    return campaign


@router.get("/campaigns", response_model=List[Campaign])
async def get_campaigns(
    status: Optional[str] = None, 
    limit: int = 50,
    current_user: dict = Depends(require_permission(Permission.CAMPAIGNS_READ))
):
    """Get campaigns with optional filters"""
    query = {}
    if status:
        query['status'] = status
    
    cursor = db.campaigns.find(query).sort("created_at", -1).limit(limit)
    campaigns = []
    async for doc in cursor:
        cr = doc.get('created_at')
        ur = doc.get('updated_at')
        if isinstance(cr, str):
            try:
                doc['created_at'] = datetime.fromisoformat(cr)
            except Exception:
                doc['created_at'] = datetime.now(timezone.utc)
        elif isinstance(cr, datetime):
            doc['created_at'] = cr if cr.tzinfo else cr.replace(tzinfo=timezone.utc)
        else:
            doc['created_at'] = datetime.now(timezone.utc)
        if isinstance(ur, str):
            try:
                doc['updated_at'] = datetime.fromisoformat(ur)
            except Exception:
                doc['updated_at'] = doc['created_at']
        elif isinstance(ur, datetime):
            doc['updated_at'] = ur if ur.tzinfo else ur.replace(tzinfo=timezone.utc)
        else:
            doc['updated_at'] = doc['created_at']
        campaigns.append(Campaign(**doc))
    return campaigns


# AI Recommendations Endpoints
@router.post("/ai/recommendations", response_model=AIRecommendation)
async def create_recommendation(recommendation: AIRecommendation):
    """Create a new AI recommendation"""
    rec_dict = recommendation.model_dump()
    rec_dict['created_at'] = recommendation.created_at.isoformat()
    await db.ai_recommendations.insert_one(rec_dict)
    return recommendation


@router.get("/ai/recommendations", response_model=List[AIRecommendation])
async def get_recommendations(status: Optional[str] = None, priority: Optional[str] = None, limit: int = 20):
    """Get AI recommendations"""
    query = {}
    if status:
        query['status'] = status
    if priority:
        query['priority'] = priority
    
    cursor = db.ai_recommendations.find(query).sort("created_at", -1).limit(limit)
    recommendations = []
    async for doc in cursor:
        # Remove MongoDB _id field
        doc.pop('_id', None)
        doc['created_at'] = datetime.fromisoformat(doc['created_at'])
        recommendations.append(AIRecommendation(**doc))
    return recommendations


# Dashboard Endpoints
@router.get("/dashboard/metrics", response_model=DashboardMetrics)
async def get_dashboard_metrics():
    """Get current dashboard metrics"""
    # Calculate date range (last 30 days)
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=30)
    
    # Get page views
    page_views = await db.pageviews.count_documents({})
    
    # Get unique sessions
    unique_sessions_list = await db.pageviews.distinct("session_id")
    
    # Get leads
    leads = await db.leads.count_documents({})
    
    # Get bookings
    bookings_cursor = db.bookings.find({})
    
    total_bookings = 0
    total_revenue = 0.0
    tanning_bookings = 0
    nails_bookings = 0
    revenue_by_service = {"tanning": 0.0, "nails": 0.0, "laundry": 0.0, "drinks": 0.0}
    
    async for booking in bookings_cursor:
        total_bookings += 1
        total_revenue += booking.get('revenue', 0.0)
        service = booking.get('service', '')
        if service == 'tanning':
            tanning_bookings += 1
            revenue_by_service['tanning'] += booking.get('revenue', 0.0)
        elif service == 'nails':
            nails_bookings += 1
            revenue_by_service['nails'] += booking.get('revenue', 0.0)
    
    # Get active campaigns
    active_campaigns = await db.campaigns.count_documents({"status": "active"})
    
    # Get AI recommendations
    ai_recommendations_total = await db.ai_recommendations.count_documents({})
    ai_recommendations_implemented = await db.ai_recommendations.count_documents({"status": "implemented"})
    
    # Calculate metrics
    unique_sessions = len(unique_sessions_list)
    conversion_rate = (leads / unique_sessions * 100) if unique_sessions > 0 else 0
    monthly_goal = 83333.33  # $1M / 12
    revenue_progress = (total_revenue / monthly_goal * 100) if monthly_goal > 0 else 0
    
    metrics = DashboardMetrics(
        date=end_date,
        total_visitors=unique_sessions,
        page_views=page_views,
        unique_sessions=unique_sessions,
        total_leads=leads,
        total_bookings=total_bookings,
        conversion_rate=conversion_rate,
        total_revenue=total_revenue,
        revenue_by_service=revenue_by_service,
        tanning_bookings=tanning_bookings,
        nails_bookings=nails_bookings,
        active_campaigns=active_campaigns,
        revenue_progress_percent=revenue_progress,
        ai_recommendations_generated=ai_recommendations_total,
        ai_recommendations_implemented=ai_recommendations_implemented
    )
    
    return metrics


@router.get("/dashboard/revenue-history")
async def get_revenue_history(days: int = 30):
    """Get daily revenue history"""
    # This would aggregate bookings by date
    # For now, return mock data structure
    history = []
    for i in range(days):
        date = datetime.now(timezone.utc) - timedelta(days=i)
        history.append({
            "date": date.isoformat(),
            "revenue": 0.0,
            "bookings": 0
        })
    return history
