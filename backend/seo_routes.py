"""
SEO Routes - Sitemap, Robots.txt
"""
from fastapi import APIRouter, Response
from fastapi.responses import PlainTextResponse
from datetime import datetime
from typing import List
import os

router = APIRouter(tags=["seo"])

BASE_URL = os.environ.get('APP_URL', 'https://bogodeals.preview.emergentagent.com')

# Define all public pages with priority and change frequency
PUBLIC_PAGES = [
    {"path": "/", "priority": "1.0", "changefreq": "daily"},
    {"path": "/tanning", "priority": "0.9", "changefreq": "weekly"},
    {"path": "/drinks", "priority": "0.9", "changefreq": "weekly"},
    {"path": "/laundry", "priority": "0.8", "changefreq": "monthly"},
    {"path": "/nails", "priority": "0.8", "changefreq": "monthly"},
    {"path": "/locations", "priority": "0.8", "changefreq": "monthly"},
    {"path": "/blog", "priority": "0.7", "changefreq": "weekly"},
    {"path": "/about", "priority": "0.6", "changefreq": "monthly"},
]

@router.get("/sitemap.xml")
async def generate_sitemap():
    """Generate XML sitemap for SEO"""
    lastmod = datetime.utcnow().strftime('%Y-%m-%d')
    
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for page in PUBLIC_PAGES:
        xml_content += '  <url>\n'
        xml_content += f'    <loc>{BASE_URL}{page["path"]}</loc>\n'
        xml_content += f'    <lastmod>{lastmod}</lastmod>\n'
        xml_content += f'    <changefreq>{page["changefreq"]}</changefreq>\n'
        xml_content += f'    <priority>{page["priority"]}</priority>\n'
        xml_content += '  </url>\n'
    
    xml_content += '</urlset>'
    
    return Response(content=xml_content, media_type="application/xml")

@router.get("/robots.txt")
async def generate_robots():
    """Generate robots.txt for search engine crawlers"""
    robots_content = f"""User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /receipt/

Sitemap: {BASE_URL}/sitemap.xml
"""
    return PlainTextResponse(content=robots_content)

@router.get("/api/seo/meta/{page}")
async def get_page_meta(page: str):
    """Get SEO metadata for specific page"""
    meta_data = {
        "home": {
            "title": "Eastend Tanning & Laundry - Premier Tanning Salon & Laundromat",
            "description": "Experience luxury tanning and convenient laundry services at Eastend. Monthly unlimited tanning packages, professional lotions, coin & card laundry, and fresh Fizze bubble tea drinks.",
            "keywords": "tanning salon, laundromat, bubble tea, Fizze drinks, spray tan, UV tanning, coin laundry, laundry service"
        },
        "tanning": {
            "title": "Tanning Packages - Monthly Unlimited & VIP Plans",
            "description": "Get your perfect tan with our Monthly Unlimited and VIP tanning packages. Professional UV beds, premium lotions, and expert staff. Consistent tanning delivers real results!",
            "keywords": "monthly unlimited tanning, VIP tanning package, UV tanning beds, tanning lotions, spray tan, indoor tanning"
        },
        "drinks": {
            "title": "Fizze Bubble Tea - Fresh Boba, Milk Teas & Fruit Teas",
            "description": "Refresh with Fizze bubble tea! Featuring milk teas, fruit teas, blended ice drinks, and customizable toppings. Vote for your favorite coming soon flavors!",
            "keywords": "bubble tea, boba tea, milk tea, fruit tea, Fizze drinks, tapioca pearls, boba shop"
        },
        "laundry": {
            "title": "Self-Service Laundromat - Coin & Card Operated",
            "description": "Convenient coin and card-operated laundry services at Eastend and Westend locations. Clean facilities, modern machines, and friendly service.",
            "keywords": "laundromat, coin laundry, self-service laundry, wash and fold, laundry service"
        },
        "nails": {
            "title": "Nail Salon Services - Manicures, Pedicures & More",
            "description": "Pamper yourself with professional nail services at Eastend. Expert manicures, pedicures, gel nails, and nail art in a relaxing atmosphere.",
            "keywords": "nail salon, manicure, pedicure, gel nails, nail art, nail care"
        },
        "blog": {
            "title": "Tanning & Beauty Tips Blog - Expert Advice",
            "description": "Read our latest tanning tips, skincare advice, and beauty trends. Expert insights from the Eastend team to help you look and feel your best.",
            "keywords": "tanning tips, skincare advice, beauty blog, tanning guide, UV safety"
        }
    }
    
    return meta_data.get(page, meta_data["home"])
