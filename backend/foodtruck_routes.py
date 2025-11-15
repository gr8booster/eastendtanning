"""Food Truck Booking System for 818 Food Truck Stop
Handles bookings, payments, and vendor management
"""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, date, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
import os
import base64

router = APIRouter(prefix="/api/foodtruck", tags=["foodtruck"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'eastend_db')]

class FoodTruckBooking(BaseModel):
    business_name: str
    contact_name: str
    email: EmailStr
    phone: str
    booking_date: str  # YYYY-MM-DD
    truck_description: str
    menu_items: str
    social_media: Optional[str] = None
    license_number: Optional[str] = None
    truck_photo_base64: Optional[str] = None
    menu_photo_base64: Optional[str] = None

class BookingResponse(BaseModel):
    booking_id: str
    booking_code: str
    booking_date: str
    amount: float
    status: str

@router.post("/check-availability")
async def check_availability(booking_date: str):
    """Check if a specific date is available for booking"""
    try:
        # Parse date
        target_date = datetime.strptime(booking_date, "%Y-%m-%d").date()
        
        # Check if date is in the past
        if target_date < date.today():
            return {"available": False, "reason": "Date is in the past"}
        
        # Check for existing booking on this date
        existing = await db.foodtruck_bookings.find_one({
            "booking_date": booking_date,
            "status": {"$in": ["pending", "confirmed", "paid"]}
        })
        
        if existing:
            return {
                "available": False,
                "reason": "Date already booked",
                "booked_by": existing.get("business_name", "Another vendor")
            }
        
        return {"available": True, "reason": "Date is available"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")

@router.post("/create-booking", response_model=BookingResponse)
async def create_booking(booking: FoodTruckBooking):
    """Create a new food truck booking"""
    
    # Check availability first
    availability = await check_availability(booking.booking_date)
    if not availability["available"]:
        raise HTTPException(status_code=400, detail=availability["reason"])
    
    # Generate booking ID and code
    booking_id = str(uuid.uuid4())
    booking_code = f"FT-{str(uuid.uuid4())[:8].upper()}"
    
    # Create booking document
    booking_doc = {
        "booking_id": booking_id,
        "booking_code": booking_code,
        "business_name": booking.business_name,
        "contact_name": booking.contact_name,
        "email": booking.email,
        "phone": booking.phone,
        "booking_date": booking.booking_date,
        "truck_description": booking.truck_description,
        "menu_items": booking.menu_items,
        "social_media": booking.social_media,
        "license_number": booking.license_number,
        "truck_photo_base64": booking.truck_photo_base64,
        "menu_photo_base64": booking.menu_photo_base64,
        "amount": 70.00,
        "status": "pending",  # pending -> paid -> confirmed
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    await db.foodtruck_bookings.insert_one(booking_doc)
    
    return BookingResponse(
        booking_id=booking_id,
        booking_code=booking_code,
        booking_date=booking.booking_date,
        amount=70.00,
        status="pending"
    )

@router.get("/booking/{booking_id}")
async def get_booking(booking_id: str):
    """Get booking details by ID"""
    booking = await db.foodtruck_bookings.find_one({"booking_id": booking_id})
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking.pop('_id', None)
    return booking

@router.patch("/booking/{booking_id}/payment")
async def update_payment_status(booking_id: str, payment_status: str, paypal_order_id: Optional[str] = None):
    """Update payment status after PayPal payment"""
    update_data = {
        "payment_status": payment_status,
        "updated_at": datetime.now(timezone.utc)
    }
    
    if payment_status == "paid":
        update_data["status"] = "confirmed"
        update_data["confirmed_at"] = datetime.now(timezone.utc)
    
    if paypal_order_id:
        update_data["paypal_order_id"] = paypal_order_id
    
    result = await db.foodtruck_bookings.update_one(
        {"booking_id": booking_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return {"message": "Payment status updated", "status": "confirmed" if payment_status == "paid" else "pending"}

@router.get("/upcoming-bookings")
async def get_upcoming_bookings(days: int = 7):
    """Get confirmed bookings for the next N days"""
    today = date.today()
    end_date = today + timedelta(days=days)
    
    bookings = await db.foodtruck_bookings.find({
        "booking_date": {
            "$gte": today.strftime("%Y-%m-%d"),
            "$lte": end_date.strftime("%Y-%m-%d")
        },
        "status": "confirmed"
    }).sort("booking_date", 1).to_list(length=100)
    
    for booking in bookings:
        booking.pop('_id', None)
    
    return bookings

@router.get("/next-upcoming")
async def get_next_upcoming():
    """Get the next confirmed booking (for Coming Soon section)"""
    today = date.today()
    
    booking = await db.foodtruck_bookings.find_one(
        {
            "booking_date": {"$gte": today.strftime("%Y-%m-%d")},
            "status": "confirmed"
        },
        sort=[("booking_date", 1)]
    )
    
    if not booking:
        return None
    
    booking.pop('_id', None)
    return booking

@router.get("/calendar")
async def get_calendar_availability(month: Optional[str] = None):
    """Get availability calendar for a specific month"""
    if month:
        # Parse YYYY-MM
        try:
            year, mon = map(int, month.split('-'))
            start_date = date(year, mon, 1)
            if mon == 12:
                end_date = date(year + 1, 1, 1) - timedelta(days=1)
            else:
                end_date = date(year, mon + 1, 1) - timedelta(days=1)
        except:
            raise HTTPException(status_code=400, detail="Invalid month format. Use YYYY-MM")
    else:
        # Current month
        today = date.today()
        start_date = date(today.year, today.month, 1)
        if today.month == 12:
            end_date = date(today.year + 1, 1, 1) - timedelta(days=1)
        else:
            end_date = date(today.year, today.month + 1, 1) - timedelta(days=1)
    
    # Get all bookings in date range
    bookings = await db.foodtruck_bookings.find({
        "booking_date": {
            "$gte": start_date.strftime("%Y-%m-%d"),
            "$lte": end_date.strftime("%Y-%m-%d")
        },
        "status": {"$in": ["pending", "confirmed", "paid"]}
    }).to_list(length=100)
    
    # Create calendar data
    booked_dates = {b["booking_date"]: b.get("business_name", "Booked") for b in bookings}
    
    return {
        "month": start_date.strftime("%Y-%m"),
        "start_date": start_date.strftime("%Y-%m-%d"),
        "end_date": end_date.strftime("%Y-%m-%d"),
        "booked_dates": booked_dates
    }
