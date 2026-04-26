from fastapi import APIRouter, HTTPException
from app.db.crud import get_customer, save_recommendations
from app.ml.recommendations import generate_recommendations
import traceback

router = APIRouter()

@router.get("/recommendations/{upload_id}/{customer_id}")
async def get_recommendations(upload_id: str, customer_id: str):
    customer = await get_customer(upload_id, customer_id)

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    if customer.get("recommendations"):
        return {"recommendations": customer["recommendations"], "cached": True}

    if customer["riskLevel"] == "Low":
        return {"recommendations": [], "cached": False}

    try:
        recommendations = generate_recommendations(
            customer_id=customer_id,
            churn_probability=customer["churnProbability"],
            risk_level=customer["riskLevel"],
            shap_explanation=customer.get("shapExplanation", [])
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to generate: {str(e)}")

    await save_recommendations(upload_id, customer_id, recommendations)
    return {"recommendations": recommendations, "cached": False}