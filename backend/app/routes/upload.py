from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io
from ml.predict import predict_churn

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    # Read the file contents into memory
    contents = await file.read()

    # Convert raw bytes into a pandas DataFrame
    df = pd.read_csv(io.StringIO(contents.decode('utf-8')))

    results = predict_churn(df)

    # Calculate summary statistics for the dashboard
    total = len(results)
    churners = sum(1 for r in results if r['riskLevel'] in ['Medium', 'High'])
    high_risk = sum(1 for r in results if r['riskLevel'] == 'High')
    medium_risk = sum(1 for r in results if r['riskLevel'] == 'Medium')
    low_risk = sum(1 for r in results if r['riskLevel'] == 'Low')

    return {
        "summary": {
            "totalCustomers": total,
            "predictedChurners": churners,
            "churnRate": round(churners / total * 100, 2),
            "highRisk": high_risk,
            "mediumRisk": medium_risk,
            "lowRisk": low_risk
        },
        "customers": results
    }