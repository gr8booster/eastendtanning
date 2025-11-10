"""
Fizze Drinks Menu Management API
CRUD operations for drinks menu with availability toggle and voting
"""
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone
import uuid
from routes import db
from auth import verify_token
from rate_limiter import rate_limit

fizze_router = APIRouter(prefix="/api/fizze")

class FizzeDrink(BaseModel):
    id: Optional[str] = None
    name: str
    category: str  # Milk Teas, Fruit Teas, Blended Ice, Hot Boba, House Specials, Toppings
    flavor_profile: str
    recipe: str
    price: Optional[float] = None
    image_url: Optional[str] = None
    available: bool = True
    coming_soon: bool = False
    votes: int = 0
    display_order: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

# Admin routes (JWT protected)
@fizze_router.post("/admin/drinks")
@require_admin
async def create_drink(drink: FizzeDrink):
    drink_data = drink.dict(exclude={'id', 'created_at', 'updated_at'})
    drink_data['id'] = str(uuid.uuid4())
    drink_data['created_at'] = datetime.now(timezone.utc)
    drink_data['updated_at'] = datetime.now(timezone.utc)
    drink_data['votes'] = 0
    
    await db.fizze_drinks.insert_one(drink_data)
    return {"success": True, "drink_id": drink_data['id']}

@fizze_router.get("/admin/drinks")
@require_admin
async def list_all_drinks():
    drinks = await db.fizze_drinks.find().sort("display_order", 1).to_list(length=500)
    for drink in drinks:
        drink.pop('_id', None)
    return drinks

@fizze_router.patch("/admin/drinks/{drink_id}")
@require_admin
async def update_drink(drink_id: str, updates: dict):
    updates['updated_at'] = datetime.now(timezone.utc)
    result = await db.fizze_drinks.update_one(
        {"id": drink_id},
        {"$set": updates}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Drink not found")
    return {"success": True}

@fizze_router.delete("/admin/drinks/{drink_id}")
@require_admin
async def delete_drink(drink_id: str):
    result = await db.fizze_drinks.delete_one({"id": drink_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Drink not found")
    return {"success": True}

# Public routes
@fizze_router.get("/menu")
async def get_menu():
    """Get available drinks grouped by category"""
    drinks = await db.fizze_drinks.find({"available": True}).sort("display_order", 1).to_list(length=500)
    
    # Group by category
    menu = {}
    for drink in drinks:
        drink.pop('_id', None)
        category = drink['category']
        if category not in menu:
            menu[category] = []
        menu[category].append(drink)
    
    return menu

@fizze_router.get("/coming-soon")
async def get_coming_soon():
    """Get drinks marked as coming soon with vote counts"""
    drinks = await db.fizze_drinks.find({"coming_soon": True}).sort("votes", -1).to_list(length=100)
    for drink in drinks:
        drink.pop('_id', None)
    return drinks

@fizze_router.post("/vote/{drink_id}")
@rate_limit(max_requests=10, window_seconds=3600)
async def vote_for_drink(request: Request, drink_id: str):
    """Vote for a coming soon drink"""
    result = await db.fizze_drinks.update_one(
        {"id": drink_id, "coming_soon": True},
        {"$inc": {"votes": 1}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Drink not found or not in coming soon")
    
    drink = await db.fizze_drinks.find_one({"id": drink_id})
    return {"success": True, "votes": drink.get('votes', 0)}
