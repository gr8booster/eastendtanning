from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid


# Analytics Models
class PageView(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    page_url: str
    page_title: str
    referrer: Optional[str] = None
    user_agent: Optional[str] = None
    session_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ConversionEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_type: str  # 'call_click', 'booking_started', 'form_submitted', 'lead_captured'
    event_data: Dict[str, Any]
    page_url: str
    session_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Lead Models
class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    service_interest: str  # 'tanning', 'laundry', 'drinks', 'nails'
    source: str  # 'popup', 'contact_form', 'booking_form'
    notes: Optional[str] = None
    status: str = "new"  # 'new', 'contacted', 'converted', 'lost'
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LeadCreate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    service_interest: str
    source: str
    notes: Optional[str] = None


# Booking Models
class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    service: str  # 'tanning', 'nails'
    customer_name: str
    customer_email: Optional[str] = None
    customer_phone: str
    booking_date: datetime
    status: str = "pending"  # 'pending', 'confirmed', 'completed', 'cancelled'
    notes: Optional[str] = None
    revenue: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BookingCreate(BaseModel):
    service: str
    customer_name: str
    customer_email: Optional[str] = None
    customer_phone: str
    booking_date: datetime
    notes: Optional[str] = None


# Campaign Models
class Campaign(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # 'email', 'sms', 'social', 'google_update', 'seo'
    status: str = "draft"  # 'draft', 'active', 'paused', 'completed'
    target_service: Optional[str] = None  # 'tanning', 'laundry', 'drinks', 'nails', 'all'
    content: Dict[str, Any]
    metrics: Dict[str, Any] = Field(default_factory=dict)  # impressions, clicks, conversions, roi
    created_by: str = "ai_engine"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CampaignCreate(BaseModel):
    name: str
    type: str
    target_service: Optional[str] = None
    content: Dict[str, Any]


# AI Recommendation Models
class AIRecommendation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    recommendation_type: str  # 'marketing', 'pricing', 'promotion', 'content'
    priority: str = "medium"  # 'low', 'medium', 'high', 'urgent'
    title: str
    description: str
    suggested_action: Union[str, List[str]]  # Can be string or list of steps
    estimated_impact: str
    ai_model: str  # 'gpt-4', 'claude'
    status: str = "pending"  # 'pending', 'in_progress', 'implemented', 'rejected'
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Dashboard Metrics Model
class DashboardMetrics(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Traffic Metrics
    total_visitors: int = 0
    page_views: int = 0
    unique_sessions: int = 0
    avg_session_duration: float = 0.0
    
    # Conversion Metrics
    total_leads: int = 0
    total_bookings: int = 0
    conversion_rate: float = 0.0
    
    # Revenue Metrics
    total_revenue: float = 0.0
    revenue_by_service: Dict[str, float] = Field(default_factory=dict)
    
    # Service Breakdown
    tanning_bookings: int = 0
    nails_bookings: int = 0
    laundry_customers: int = 0
    drinks_orders: int = 0
    
    # Campaign Performance
    active_campaigns: int = 0
    campaign_roi: float = 0.0
    
    # Goal Progress
    monthly_revenue_goal: float = 83333.33  # $1M / 12 months
    revenue_progress_percent: float = 0.0
    
    # AI Activity
    ai_recommendations_generated: int = 0
    ai_recommendations_implemented: int = 0
