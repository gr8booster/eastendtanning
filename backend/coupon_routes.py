"""
Coupon generation routes for Reserve Online, Pay In-Store system
Generates printable coupons with tiered discount incentives and PayPal integration
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import uuid
import os

router = APIRouter()

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'test_database')
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
coupons_collection = db['reservation_coupons']

# Tax rates
SALES_TAX_RATE = 0.0725  # 7.25% Knox County, Ohio
TAN_TAX_RATE = 0.10      # 10% Federal Excise Tax (tanning packages only)

# Discount tiers (time-based incentive)
DISCOUNT_TIERS = [
    {"hours": 24, "discount": 0.15, "label": "15% OFF"},
    {"hours": 48, "discount": 0.10, "label": "10% OFF"},
    {"hours": 168, "discount": 0.05, "label": "5% OFF"}  # 7 days = 168 hours
]

class CouponItem(BaseModel):
    """Individual item in the reservation"""
    id: str
    name: str
    category: str  # "fizze", "tanning", "lotion", "nails"
    quantity: int
    price: float

class GenerateCouponRequest(BaseModel):
    """Request to generate a reservation coupon"""
    items: List[CouponItem]
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None

class CouponResponse(BaseModel):
    """Generated coupon response"""
    coupon_id: str
    coupon_code: str
    items: List[CouponItem]
    subtotal: float
    sales_tax: float
    tan_tax: float
    total_before_discount: float
    discount_tiers: List[dict]
    created_at: str
    expires_at: str
    redemption_location: str
    paypal_button_id: str

def calculate_taxes(items: List[CouponItem]) -> dict:
    """
    Calculate sales tax and tan tax based on item categories
    - Sales tax (7.25%): Applied to ALL items (fizze, tanning, lotions)
    - Tan tax (10%): Applied ONLY to tanning packages
    """
    subtotal = sum(item.price * item.quantity for item in items)
    
    # Calculate tan tax only for tanning packages
    tanning_subtotal = sum(
        item.price * item.quantity 
        for item in items 
        if item.category.lower() == 'tanning'
    )
    tan_tax = round(tanning_subtotal * TAN_TAX_RATE, 2)
    
    # Sales tax applies to everything
    sales_tax = round(subtotal * SALES_TAX_RATE, 2)
    
    total_before_discount = round(subtotal + sales_tax + tan_tax, 2)
    
    return {
        "subtotal": round(subtotal, 2),
        "sales_tax": sales_tax,
        "tan_tax": tan_tax,
        "total_before_discount": total_before_discount
    }

def calculate_discount_tiers(total_before_discount: float, created_at: datetime) -> List[dict]:
    """
    Calculate final prices for each discount tier
    15% if paid within 24 hours
    10% if paid within 48 hours
    5% if paid within 7 days
    """
    tiers = []
    for tier in DISCOUNT_TIERS:
        discount_amount = round(total_before_discount * tier["discount"], 2)
        final_price = round(total_before_discount - discount_amount, 2)
        deadline = created_at + timedelta(hours=tier["hours"])
        
        tiers.append({
            "label": tier["label"],
            "discount_percent": int(tier["discount"] * 100),
            "discount_amount": discount_amount,
            "final_price": final_price,
            "deadline": deadline.isoformat(),
            "hours_remaining": tier["hours"]
        })
    
    return tiers

@router.post("/api/coupons/generate", response_model=CouponResponse)
async def generate_coupon(request: GenerateCouponRequest):
    """
    Generate a reservation coupon for in-store payment
    
    Flow:
    1. Customer adds items to cart online
    2. Generates coupon (this endpoint)
    3. Receives printable coupon with:
       - Unique coupon code
       - Item list with taxes calculated
       - Tiered discount table (pay faster = save more)
       - PayPal payment option
    4. Brings coupon to Eastend to redeem within 7 days
    """
    try:
        # Validate items
        if not request.items or len(request.items) == 0:
            raise HTTPException(status_code=400, detail="Cart is empty")
        
        # Generate unique identifiers
        coupon_id = str(uuid.uuid4())
        coupon_code = f"EE-{uuid.uuid4().hex[:8].upper()}"
        
        # Calculate taxes
        tax_info = calculate_taxes(request.items)
        
        # Calculate discount tiers
        created_at = datetime.now(timezone.utc)
        expires_at = created_at + timedelta(days=7)
        discount_tiers = calculate_discount_tiers(tax_info["total_before_discount"], created_at)
        
        # Create coupon document
        coupon_doc = {
            "id": coupon_id,
            "coupon_code": coupon_code,
            "items": [item.dict() for item in request.items],
            "subtotal": tax_info["subtotal"],
            "sales_tax": tax_info["sales_tax"],
            "tan_tax": tax_info["tan_tax"],
            "total_before_discount": tax_info["total_before_discount"],
            "discount_tiers": discount_tiers,
            "customer_name": request.customer_name,
            "customer_email": request.customer_email,
            "customer_phone": request.customer_phone,
            "created_at": created_at,
            "expires_at": expires_at,
            "redeemed": False,
            "redeemed_at": None,
            "redemption_location": "Eastend Tanning & Laundry",
            "paypal_button_id": "4VYZ3ABTC3C6G"
        }
        
        # Store in MongoDB
        await coupons_collection.insert_one(coupon_doc)
        
        # Return response
        return CouponResponse(
            coupon_id=coupon_id,
            coupon_code=coupon_code,
            items=request.items,
            subtotal=tax_info["subtotal"],
            sales_tax=tax_info["sales_tax"],
            tan_tax=tax_info["tan_tax"],
            total_before_discount=tax_info["total_before_discount"],
            discount_tiers=discount_tiers,
            created_at=created_at.isoformat(),
            expires_at=expires_at.isoformat(),
            redemption_location="Eastend Tanning & Laundry",
            paypal_button_id="4VYZ3ABTC3C6G"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate coupon: {str(e)}")

@router.get("/api/coupons/{coupon_id}")
async def get_coupon(coupon_id: str):
    """Retrieve a coupon by ID for display"""
    try:
        coupon = await coupons_collection.find_one({"id": coupon_id})
        
        if not coupon:
            raise HTTPException(status_code=404, detail="Coupon not found")
        
        # Remove MongoDB _id field
        coupon.pop('_id', None)
        
        return coupon
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve coupon: {str(e)}")

@router.patch("/api/coupons/{coupon_id}/redeem")
async def redeem_coupon(coupon_id: str):
    """Mark coupon as redeemed (staff use only)"""
    try:
        result = await coupons_collection.update_one(
            {"id": coupon_id, "redeemed": False},
            {
                "$set": {
                    "redeemed": True,
                    "redeemed_at": datetime.now(timezone.utc)
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Coupon not found or already redeemed")
        
        return {"success": True, "message": "Coupon redeemed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to redeem coupon: {str(e)}")
