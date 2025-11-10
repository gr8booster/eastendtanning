from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone
import asyncio

# Import routes
from routes import router as api_routes_router
from ai_routes import ai_router
from auth import router as auth_router
from chat_routes import router as chat_router
from payment_routes import router as payment_router
from skin_type_routes import router as skin_type_router
from journey_routes import router as journey_router
from discount_routes import router as discount_router
from lotion_routes import router as lotion_router
from voice_routes import router as voice_router
import blog_scheduler
import marketing_worker
from fizze_routes import fizze_router
from receipt_routes import receipt_router
from seo_routes import router as seo_router


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'eastend_db')]

# Create the main app without a prefix
app = FastAPI(title="Eastend Command Center API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include all routers in the main app
app.include_router(api_router)
app.include_router(api_routes_router)  # Include the API routes
app.include_router(ai_router)  # Include the AI routes
app.include_router(auth_router)  # Include the auth routes
app.include_router(chat_router)  # Include Mary Well chat routes
app.include_router(payment_router)  # Include payment routes
app.include_router(skin_type_router)  # Include skin type evaluation routes
app.include_router(journey_router)  # Include marketing journey routes
app.include_router(discount_router)  # Include discount code routes
app.include_router(lotion_router)  # Include lotions routes
app.include_router(voice_router)  # Include voice routes
app.include_router(fizze_router)  # Include fizze routes
app.include_router(receipt_router)  # Include receipt routes
app.include_router(seo_router)  # Include SEO routes

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def start_scheduler():
    try:
        asyncio.create_task(blog_scheduler.scheduler_loop(db))
        logger.info("Blog scheduler started")
    except Exception as e:
        logger.error(f"Failed to start blog scheduler: {e}")
    
    try:
        asyncio.create_task(marketing_worker.worker_loop())
        logger.info("Marketing worker started")
    except Exception as e:
        logger.error(f"Failed to start marketing worker: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
