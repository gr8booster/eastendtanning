from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
import uuid
import base64
import os
from motor.motor_asyncio import AsyncIOMotorClient
from .auth import get_current_user, check_permission

router = APIRouter(prefix='/api/mary/training', tags=['mary-training'])

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'eastend_db')]

class TrainingUpdate(BaseModel):
    title: str
    content: str
    category: str  # 'product_info', 'policy', 'procedure', 'customer_service', 'other'
    priority: Optional[str] = 'normal'  # 'low', 'normal', 'high'
    tags: Optional[List[str]] = []
    created_by: str

class TrainingNote(BaseModel):
    update_id: str
    note: str
    created_by: str

@router.post('/updates/create')
async def create_training_update(update: TrainingUpdate, current_user: dict = Depends(get_current_user)):
    """
    Create a new training update for Mary
    Requires: Manager Admin (Level 2) or Owner/Admin (Level 1)
    """
    if not check_permission(current_user, 'mary_training', 'write'):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    update_id = str(uuid.uuid4())
    update_data = update.dict()
    update_data['update_id'] = update_id
    update_data['created_at'] = datetime.now(timezone.utc).isoformat()
    update_data['status'] = 'active'
    update_data['attachments'] = []
    update_data['notes'] = []
    
    await db.mary_training.insert_one(update_data)
    
    return {
        'success': True,
        'update_id': update_id,
        'message': 'Training update created successfully'
    }

@router.post('/updates/{update_id}/attachment')
async def upload_training_attachment(update_id: str, file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    """
    Upload attachment (image, video, file) for a training update
    Requires: Manager Admin (Level 2) or Owner/Admin (Level 1)
    """
    if not check_permission(current_user, 'mary_training', 'write'):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    # Read file and convert to base64
    content = await file.read()
    base64_content = base64.b64encode(content).decode('utf-8')
    
    attachment = {
        'attachment_id': str(uuid.uuid4()),
        'filename': file.filename,
        'content_type': file.content_type,
        'data': base64_content,
        'uploaded_by': current_user.get('email'),
        'uploaded_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.mary_training.update_one(
        {'update_id': update_id},
        {'$push': {'attachments': attachment}}
    )
    
    return {'success': True, 'message': 'Attachment uploaded successfully', 'attachment_id': attachment['attachment_id']}

@router.get('/updates/all')
async def get_all_training_updates(current_user: dict = Depends(get_current_user)):
    """
    Get all training updates
    Requires: Any admin level (Level 3 can read)
    """
    if not check_permission(current_user, 'mary_training', 'read'):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    updates = await db.mary_training.find({}).sort('created_at', -1).to_list(200)
    
    # Remove MongoDB _id and large base64 data for list view
    for update in updates:
        update.pop('_id', None)
        # Remove attachment data from list view (just keep metadata)
        if 'attachments' in update:
            for attachment in update['attachments']:
                attachment.pop('data', None)
    
    return {'success': True, 'updates': updates}

@router.get('/updates/{update_id}')
async def get_training_update(update_id: str, current_user: dict = Depends(get_current_user)):
    """
    Get a specific training update with full details
    Requires: Any admin level
    """
    if not check_permission(current_user, 'mary_training', 'read'):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    update = await db.mary_training.find_one({'update_id': update_id})
    
    if not update:
        raise HTTPException(status_code=404, detail="Training update not found")
    
    update.pop('_id', None)
    
    return {'success': True, 'update': update}

@router.post('/updates/{update_id}/note')
async def add_training_note(update_id: str, note_data: TrainingNote, current_user: dict = Depends(get_current_user)):
    """
    Add a note/comment to a training update
    Requires: Any admin level
    """
    if not check_permission(current_user, 'mary_training', 'read'):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    note = {
        'note_id': str(uuid.uuid4()),
        'note': note_data.note,
        'created_by': current_user.get('email'),
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.mary_training.update_one(
        {'update_id': update_id},
        {'$push': {'notes': note}}
    )
    
    return {'success': True, 'message': 'Note added successfully'}

@router.patch('/updates/{update_id}/status')
async def update_training_status(update_id: str, status: str, current_user: dict = Depends(get_current_user)):
    """
    Update status of a training update (active, archived, pending)
    Requires: Manager Admin (Level 2) or Owner/Admin (Level 1)
    """
    if not check_permission(current_user, 'mary_training', 'write'):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    await db.mary_training.update_one(
        {'update_id': update_id},
        {'$set': {
            'status': status,
            'updated_at': datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return {'success': True, 'message': 'Status updated successfully'}

@router.delete('/updates/{update_id}')
async def delete_training_update(update_id: str, current_user: dict = Depends(get_current_user)):
    """
    Delete a training update
    Requires: Owner/Admin (Level 1) only
    """
    if current_user.get('role') != 'owner':
        raise HTTPException(status_code=403, detail="Only owners can delete training updates")
    
    result = await db.mary_training.delete_one({'update_id': update_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Training update not found")
    
    return {'success': True, 'message': 'Training update deleted successfully'}

@router.get('/summary')
async def get_training_summary(current_user: dict = Depends(get_current_user)):
    """
    Get summary stats for Mary's training
    Requires: Any admin level
    """
    if not check_permission(current_user, 'mary_training', 'read'):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    total_updates = await db.mary_training.count_documents({})
    active_updates = await db.mary_training.count_documents({'status': 'active'})
    
    # Get category breakdown
    categories = await db.mary_training.aggregate([
        {'$group': {'_id': '$category', 'count': {'$sum': 1}}}
    ]).to_list(20)
    
    return {
        'success': True,
        'summary': {
            'total_updates': total_updates,
            'active_updates': active_updates,
            'categories': {cat['_id']: cat['count'] for cat in categories}
        }
    }
