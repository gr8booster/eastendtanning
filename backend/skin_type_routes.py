"""
Skin Type Evaluation Form - Ohio State Cosmetology Board Required
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
import uuid

from motor.motor_asyncio import AsyncIOMotorClient
import os

router = APIRouter(prefix="/api/skin-type", tags=["skin_type"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

class SkinTypeEvaluation(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    
    # Skin Type Questions
    natural_hair_color: str  # Black, Dark Brown, Brown, Lt Brown, Blonde, Red
    natural_eye_color: str  # Black, Dark Brown, Brown, Lt Brown, Blue, Green
    natural_skin_color: str  # Black, Dark Brown, Brown, Lt Brown, Medium, Pale
    
    # Tanning Response
    first_exposure_response: str  # Burn w/ no tan, Burn w/ little tan, Burn then tan, Tan w/ no burn
    
    # Risk Factors
    freckles_naturally: bool
    had_three_or_more_sunburns: bool
    worked_outdoors_as_teen: bool
    
    # Additional Info
    age_range: str  # 18-25, 26-35, 36-45, 46-55, 56+
    medical_conditions: Optional[str] = None
    medications: Optional[str] = None
    
    # Agreement
    agrees_to_follow_recommendations: bool = False
    
class SkinTypeResult(BaseModel):
    id: str
    customer_name: str
    skin_type: int  # 1-6 Fitzpatrick scale
    recommendation: str
    max_session_time: int  # minutes
    warning_level: str  # low, medium, high
    completed_at: str

@router.post("/submit", response_model=SkinTypeResult)
async def submit_skin_type_evaluation(evaluation: SkinTypeEvaluation):
    """Submit skin type evaluation form"""
    
    if not evaluation.agrees_to_follow_recommendations:
        raise HTTPException(
            status_code=400,
            detail="You must agree to follow tanning recommendations"
        )
    
    # Calculate Fitzpatrick Skin Type (1-6)
    # This is a simplified algorithm based on common factors
    skin_type_score = 0
    
    # Natural coloring factors
    if evaluation.natural_skin_color in ["Black", "Dark Brown"]:
        skin_type_score += 4
    elif evaluation.natural_skin_color in ["Brown", "Lt Brown"]:
        skin_type_score += 3
    elif evaluation.natural_skin_color == "Medium":
        skin_type_score += 2
    else:
        skin_type_score += 1
    
    # Tanning response
    if "no burn" in evaluation.first_exposure_response.lower():
        skin_type_score += 3
    elif "then tan" in evaluation.first_exposure_response.lower():
        skin_type_score += 2
    elif "little tan" in evaluation.first_exposure_response.lower():
        skin_type_score += 1
    
    # Risk factors (reduce score if high risk)
    if evaluation.freckles_naturally:
        skin_type_score -= 1
    if evaluation.had_three_or_more_sunburns:
        skin_type_score -= 1
    
    # Determine final skin type (1-6)
    if skin_type_score <= 2:
        skin_type = 1
        max_time = 5
        warning = "high"
        recommendation = "Type I (Very Fair): You should avoid sun exposure and use extra caution with tanning. Start with Level 1 for only 3-5 minutes."\n    elif skin_type_score <= 4:
        skin_type = 2
        max_time = 8
        warning = "high"
        recommendation = "Type II (Fair): You have sensitive skin. Start with Level 1 for 5-8 minutes and gradually increase."\n    elif skin_type_score <= 6:
        skin_type = 3
        max_time = 12
        warning = "medium"
        recommendation = "Type III (Medium): You tan gradually. Start with Level 1 or 2 for 8-12 minutes."\n    elif skin_type_score <= 8:
        skin_type = 4
        max_time = 15
        warning = "medium"
        recommendation = "Type IV (Olive): You tan easily. You can start with Level 2 for 10-15 minutes."\n    elif skin_type_score <= 10:
        skin_type = 5
        max_time = 18
        warning = "low"
        recommendation = "Type V (Brown): You rarely burn. You can use Level 2 or 3 for 12-18 minutes."\n    else:
        skin_type = 6
        max_time = 20
        warning = "low"
        recommendation = "Type VI (Dark Brown/Black): You have natural protection. You can use Level 3 or 4 for 15-20 minutes."\n    
    # Create result\n    result_id = str(uuid.uuid4())\n    result = {\n        \"id\": result_id,\n        \"customer_name\": evaluation.customer_name,\n        \"customer_email\": evaluation.customer_email,\n        \"customer_phone\": evaluation.customer_phone,\n        \"skin_type\": skin_type,\n        \"recommendation\": recommendation,\n        \"max_session_time\": max_time,\n        \"warning_level\": warning,\n        \"evaluation_data\": evaluation.dict(),\n        \"completed_at\": datetime.now(timezone.utc),\n        \"status\": \"completed\"\n    }\n    \n    # Store in database\n    await db.skin_type_evaluations.insert_one(result)\n    \n    return SkinTypeResult(\n        id=result_id,\n        customer_name=evaluation.customer_name,\n        skin_type=skin_type,\n        recommendation=recommendation,\n        max_session_time=max_time,\n        warning_level=warning,\n        completed_at=result[\"completed_at\"].isoformat()\n    )

@router.get(\"/check/{customer_phone}\")\nasync def check_skin_type_completion(customer_phone: str):
    \"\"\"Check if customer has completed skin type evaluation\"\"\"\n    \n    evaluation = await db.skin_type_evaluations.find_one(\n        {\"customer_phone\": customer_phone},\n        sort=[(\"completed_at\", -1)]\n    )\n    \n    if not evaluation:\n        return {\n            \"completed\": False,\n            \"message\": \"No skin type evaluation found for this phone number\"\n        }\n    \n    evaluation.pop('_id', None)\n    evaluation['completed_at'] = evaluation['completed_at'].isoformat()\n    \n    return {\n        \"completed\": True,\n        \"evaluation\": evaluation\n    }
