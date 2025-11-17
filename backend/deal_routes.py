from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
import uuid
import base64
import os
from motor.motor_asyncio import AsyncIOMotorClient
from .auth import get_current_user, check_permission

router = APIRouter(prefix='/api/deals', tags=['deals'])

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'eastend_db')]

class Deal(BaseModel):
    title: str
    description: str
    original_price: Optional[float] = None
    deal_price: float
    start_date: str
    end_date: str
    media_type: Optional[str] = None  # 'image' or 'video'
    media_data: Optional[str] = None  # base64 encoded
    is_active: bool = True
    created_by: str
    created_at: Optional[str] = None

class DealUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    original_price: Optional[float] = None
    deal_price: Optional[float] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_active: Optional[bool] = None

@router.post('/create')
async def create_deal(deal: Deal, current_user: dict = Depends(get_current_user)):
    """
    Create a new Deal of the Month
    Requires: Manager Admin (Level 2) or Owner/Admin (Level 1)
    """
    # Check permission
    if not check_permission(current_user, 'deals', 'write'):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    deal_id = str(uuid.uuid4())
    deal_data = deal.dict()
    deal_data['deal_id'] = deal_id
    deal_data['created_at'] = datetime.now(timezone.utc).isoformat()
    deal_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.deals.insert_one(deal_data)
    
    return {
        'success': True,
        'deal_id': deal_id,
        'message': 'Deal created successfully'
    }

@router.get('/current')
async def get_current_deal():
    """
    Get the current active Deal of the Month
    Public endpoint - no auth required
    """
    now = datetime.now(timezone.utc).isoformat()
    
    deal = await db.deals.find_one({
        'is_active': True,
        'start_date': {'$lte': now},
        'end_date': {'$gte': now}
    })
    
    if not deal:
        return {'success': True, 'deal': None}
    
    # Remove MongoDB _id
    deal.pop('_id', None)
    
    return {'success': True, 'deal': deal}

@router.get('/all')
async def get_all_deals(current_user: dict = Depends(get_current_user)):
    """
    Get all deals (admin only)
    Requires: Any admin level
    """
    if not check_permission(current_user, 'deals', 'read'):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    deals = await db.deals.find({}).sort('created_at', -1).to_list(100)
    
    # Remove MongoDB _id from all deals
    for deal in deals:
        deal.pop('_id', None)
    
    return {'success': True, 'deals': deals}

@router.get('/{deal_id}')
async def get_deal(deal_id: str, current_user: dict = Depends(get_current_user)):
    """
    Get a specific deal by ID
    Requires: Any admin level
    """
    if not check_permission(current_user, 'deals', 'read'):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    deal = await db.deals.find_one({'deal_id': deal_id})
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    deal.pop('_id', None)
    
    return {'success': True, 'deal': deal}

@router.patch('/{deal_id}')
async def update_deal(deal_id: str, deal_update: DealUpdate, current_user: dict = Depends(get_current_user)):
    """
    Update an existing deal
    Requires: Manager Admin (Level 2) or Owner/Admin (Level 1)
    """
    if not check_permission(current_user, 'deals', 'write'):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    # Get existing deal
    existing_deal = await db.deals.find_one({'deal_id': deal_id})
    if not existing_deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    # Update only provided fields
    update_data = {k: v for k, v in deal_update.dict().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.deals.update_one(
        {'deal_id': deal_id},
        {'$set': update_data}
    )
    
    return {'success': True, 'message': 'Deal updated successfully'}

@router.delete('/{deal_id}')
async def delete_deal(deal_id: str, current_user: dict = Depends(get_current_user)):
    """
    Delete a deal
    Requires: Owner/Admin (Level 1) only
    """
    if current_user.get('role') != 'owner':
        raise HTTPException(status_code=403, detail="Only owners can delete deals")
    
    result = await db.deals.delete_one({'deal_id': deal_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    return {'success': True, 'message': 'Deal deleted successfully'}

@router.post('/{deal_id}/media')
async def upload_deal_media(deal_id: str, file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    """
    Upload media (image/video) for a deal
    Requires: Manager Admin (Level 2) or Owner/Admin (Level 1)
    """
    if not check_permission(current_user, 'deals', 'write'):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    # Read file and convert to base64
    content = await file.read()
    base64_content = base64.b64encode(content).decode('utf-8')
    
    # Determine media type
    media_type = 'image' if file.content_type.startswith('image/') else 'video'
    
    # Update deal with media
    await db.deals.update_one(
        {'deal_id': deal_id},
        {'$set': {
            'media_type': media_type,
            'media_data': base64_content,
            'media_filename': file.filename,
            'media_content_type': file.content_type,
            'updated_at': datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return {'success': True, 'message': 'Media uploaded successfully', 'media_type': media_type}
