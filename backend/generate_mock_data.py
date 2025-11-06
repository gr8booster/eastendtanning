"""
Mock Data Generator for Eastend Command Center
Populates the database with realistic mock data for testing
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timedelta, timezone
import random
import uuid
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'eastend_db')]


async def generate_mock_data():
    print("🚀 Generating mock data for Eastend Command Center...")
    
    # Clear existing data
    print("Clearing existing data...")
    await db.pageviews.delete_many({})
    await db.conversions.delete_many({})
    await db.leads.delete_many({})
    await db.bookings.delete_many({})
    await db.campaigns.delete_many({})
    await db.ai_recommendations.delete_many({})
    
    # Generate data for last 30 days
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=30)
    
    # 1. Page Views (500-1000 per day)
    print("📊 Generating page views...")
    pages = [
        {"url": "/", "title": "Home"},
        {"url": "/tanning", "title": "Tanning Studio"},
        {"url": "/laundry", "title": "Laundromat"},
        {"url": "/drinks", "title": "Fizze Drinks"},
        {"url": "/nails", "title": "Fast Nails"},
        {"url": "/locations", "title": "Locations"},
        {"url": "/contact", "title": "Contact"}
    ]
    
    referrers = [
        "https://www.google.com/search",
        "https://www.facebook.com/",
        "https://www.instagram.com/",
        "direct",
        "https://www.yelp.com/"
    ]
    
    pageviews = []
    for day in range(30):
        current_date = start_date + timedelta(days=day)
        daily_views = random.randint(500, 1000)
        
        for _ in range(daily_views):
            page = random.choice(pages)
            timestamp = current_date + timedelta(
                hours=random.randint(6, 22),
                minutes=random.randint(0, 59)
            )
            
            pageviews.append({
                "id": str(uuid.uuid4()),
                "page_url": page["url"],
                "page_title": page["title"],
                "referrer": random.choice(referrers),
                "user_agent": "Mozilla/5.0",
                "session_id": str(uuid.uuid4()),
                "timestamp": timestamp.isoformat()
            })
    
    if pageviews:
        await db.pageviews.insert_many(pageviews)
        print(f"   ✅ Created {len(pageviews)} page views")
    
    # 2. Conversions (call clicks, bookings started)
    print("🎯 Generating conversions...")
    conversions = []
    conversion_types = [
        "call_click",
        "booking_started",
        "directions_click",
        "lead_captured"
    ]
    
    for day in range(30):
        current_date = start_date + timedelta(days=day)
        daily_conversions = random.randint(20, 50)
        
        for _ in range(daily_conversions):
            timestamp = current_date + timedelta(
                hours=random.randint(8, 20),
                minutes=random.randint(0, 59)
            )
            
            conversions.append({
                "id": str(uuid.uuid4()),
                "event_type": random.choice(conversion_types),
                "event_data": {"value": "mock"},
                "page_url": random.choice([p["url"] for p in pages]),
                "session_id": str(uuid.uuid4()),
                "timestamp": timestamp.isoformat()
            })
    
    if conversions:
        await db.conversions.insert_many(conversions)
        print(f"   ✅ Created {len(conversions)} conversion events")
    
    # 3. Leads
    print("📋 Generating leads...")
    leads = []
    services = ["tanning", "laundry", "drinks", "nails"]
    sources = ["popup", "contact_form", "booking_form"]
    statuses = ["new", "contacted", "converted", "lost"]
    
    for day in range(30):
        current_date = start_date + timedelta(days=day)
        daily_leads = random.randint(5, 15)
        
        for i in range(daily_leads):
            status = random.choices(statuses, weights=[40, 30, 20, 10])[0]
            timestamp = current_date + timedelta(
                hours=random.randint(8, 20),
                minutes=random.randint(0, 59)
            )
            
            leads.append({
                "id": str(uuid.uuid4()),
                "name": f"Customer {len(leads) + 1}",
                "email": f"customer{len(leads) + 1}@example.com",
                "phone": f"740-555-{random.randint(1000, 9999)}",
                "service_interest": random.choice(services),
                "source": random.choice(sources),
                "status": status,
                "notes": "Mock lead data",
                "created_at": timestamp.isoformat(),
                "updated_at": timestamp.isoformat()
            })
    
    if leads:
        await db.leads.insert_many(leads)
        print(f"   ✅ Created {len(leads)} leads")
    
    # 4. Bookings
    print("📅 Generating bookings...")
    bookings = []
    booking_services = ["tanning", "nails"]
    booking_statuses = ["pending", "confirmed", "completed", "cancelled"]
    
    # Revenue ranges by service
    revenue_ranges = {
        "tanning": (15, 35),
        "nails": (30, 75)
    }
    
    for day in range(30):
        current_date = start_date + timedelta(days=day)
        daily_bookings = random.randint(8, 20)
        
        for i in range(daily_bookings):
            service = random.choice(booking_services)
            status = random.choices(booking_statuses, weights=[10, 30, 50, 10])[0]
            revenue = random.uniform(*revenue_ranges[service]) if status == "completed" else 0
            
            timestamp = current_date + timedelta(
                hours=random.randint(8, 19),
                minutes=random.randint(0, 59)
            )
            
            bookings.append({
                "id": str(uuid.uuid4()),
                "service": service,
                "customer_name": f"Customer {len(bookings) + 1}",
                "customer_email": f"booking{len(bookings) + 1}@example.com",
                "customer_phone": f"740-555-{random.randint(1000, 9999)}",
                "booking_date": (timestamp + timedelta(days=random.randint(1, 7))).isoformat(),
                "status": status,
                "revenue": revenue,
                "notes": "Mock booking",
                "created_at": timestamp.isoformat()
            })
    
    if bookings:
        await db.bookings.insert_many(bookings)
        total_revenue = sum(b['revenue'] for b in bookings)
        print(f"   ✅ Created {len(bookings)} bookings (${total_revenue:,.2f} revenue)")
    
    # 5. Marketing Campaigns
    print("📢 Generating campaigns...")
    campaigns = [
        {
            "id": str(uuid.uuid4()),
            "name": "Summer Tanning Special",
            "type": "email",
            "status": "active",
            "target_service": "tanning",
            "content": {"subject": "Get Your Summer Glow!", "body": "Special pricing..."},
            "metrics": {"impressions": 1250, "clicks": 187, "conversions": 23, "roi": 3.2},
            "created_by": "ai_engine",
            "created_at": (end_date - timedelta(days=15)).isoformat(),
            "updated_at": end_date.isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Nail Art Promotion",
            "type": "social",
            "status": "active",
            "target_service": "nails",
            "content": {"platform": "Facebook/Instagram", "message": "Show off your style!"},
            "metrics": {"impressions": 3400, "clicks": 420, "conversions": 35, "roi": 2.8},
            "created_by": "ai_engine",
            "created_at": (end_date - timedelta(days=10)).isoformat(),
            "updated_at": end_date.isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Fizze Happy Hour",
            "type": "sms",
            "status": "completed",
            "target_service": "drinks",
            "content": {"message": "2-for-1 drinks this Friday!"},
            "metrics": {"impressions": 840, "clicks": 156, "conversions": 42, "roi": 4.1},
            "created_by": "ai_engine",
            "created_at": (end_date - timedelta(days=20)).isoformat(),
            "updated_at": (end_date - timedelta(days=18)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Google Business Update - New Services",
            "type": "google_update",
            "status": "completed",
            "target_service": "all",
            "content": {"update": "Added Fast Nails to Google Business Profile"},
            "metrics": {"impressions": 5600, "clicks": 234, "conversions": 18, "roi": 1.5},
            "created_by": "ai_engine",
            "created_at": (end_date - timedelta(days=25)).isoformat(),
            "updated_at": (end_date - timedelta(days=23)).isoformat()
        }
    ]
    
    if campaigns:
        await db.campaigns.insert_many(campaigns)
        print(f"   ✅ Created {len(campaigns)} marketing campaigns")
    
    # 6. AI Recommendations
    print("🤖 Generating AI recommendations...")
    recommendations = [
        {
            "id": str(uuid.uuid4()),
            "recommendation_type": "marketing",
            "priority": "high",
            "title": "Launch Instagram Reels Campaign for Nail Art",
            "description": "Instagram Reels showing before/after nail transformations are trending. Estimated 40% engagement boost.",
            "suggested_action": "Create 3 Reels per week showcasing nail art designs. Partner with local influencers.",
            "estimated_impact": "+25 nail bookings/month ($1,500 revenue)",
            "ai_model": "gpt-4",
            "status": "pending",
            "created_at": (end_date - timedelta(days=2)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "recommendation_type": "pricing",
            "priority": "medium",
            "title": "Introduce Tanning Membership Tier",
            "description": "Analysis shows 60% of tanning customers visit 3+ times/month. A premium membership could increase retention.",
            "suggested_action": "Launch $69/month unlimited Level 1-3 tanning membership with lotion discount.",
            "estimated_impact": "+$4,000 monthly recurring revenue",
            "ai_model": "claude",
            "status": "in_progress",
            "created_at": (end_date - timedelta(days=5)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "recommendation_type": "promotion",
            "priority": "urgent",
            "title": "Weekend Laundry Discount to Reduce Peak Wait Times",
            "description": "Saturday mornings see 3x traffic. Incentivize off-peak usage to improve customer experience.",
            "suggested_action": "Offer 20% discount for laundry services Mon-Thu before 3pm.",
            "estimated_impact": "Improved customer satisfaction + 15% revenue increase during slow hours",
            "ai_model": "gpt-4",
            "status": "pending",
            "created_at": (end_date - timedelta(days=1)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "recommendation_type": "content",
            "priority": "medium",
            "title": "Blog: 'Tanning vs Red Light Therapy - Which is Right for You?'",
            "description": "Many customers don't understand the difference. Educational content builds trust and drives bookings.",
            "suggested_action": "Publish 800-word blog post with comparison table, skin type guide, and booking CTAs.",
            "estimated_impact": "+300 organic visitors/month, 8% conversion to bookings",
            "ai_model": "gpt-4",
            "status": "implemented",
            "created_at": (end_date - timedelta(days=12)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "recommendation_type": "marketing",
            "priority": "low",
            "title": "SMS Campaign for Drink Special Announcements",
            "description": "Fizze Drinks has low brand awareness. Weekly SMS for drink specials could drive foot traffic.",
            "suggested_action": "Collect phone numbers with 'First Drink Free' signup. Send weekly specials via SMS.",
            "estimated_impact": "+50 drink orders/week ($300-500 revenue)",
            "ai_model": "claude",
            "status": "pending",
            "created_at": (end_date - timedelta(days=3)).isoformat()
        }
    ]
    
    if recommendations:
        await db.ai_recommendations.insert_many(recommendations)
        print(f"   ✅ Created {len(recommendations)} AI recommendations")
    
    print("\n✅ Mock data generation complete!")
    print(f"\n📊 Summary:")
    print(f"   • {len(pageviews):,} page views")
    print(f"   • {len(conversions):,} conversion events")
    print(f"   • {len(leads):,} leads")
    print(f"   • {len(bookings):,} bookings (${sum(b['revenue'] for b in bookings):,.2f} revenue)")
    print(f"   • {len(campaigns)} marketing campaigns")
    print(f"   • {len(recommendations)} AI recommendations")
    print(f"\n🎯 Ready to test the Command Center dashboard!\n")


if __name__ == "__main__":
    asyncio.run(generate_mock_data())
