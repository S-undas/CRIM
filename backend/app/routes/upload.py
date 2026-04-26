from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io
from app.ml.predict import predict_churn
import json
from fastapi import Form
from app.ml.preprocess import (
    suggest_mapping, get_mapping_summary, get_base_feature_names,
    preprocess_with_mapping
)
from app.ml.predict import predict_from_processed
from app.db.crud import save_upload  

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    results = predict_churn(df)

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


def _extract_customer_ids(df: pd.DataFrame) -> list:
    """Try known ID column names; fall back to 1-based row numbers."""
    id_candidates = ['customerID', 'CustomerID', 'customer_id',
                     'Customer ID', 'customerid', 'cust_id', 'Customer']
    for col in id_candidates:
        if col in df.columns:
            return df[col].astype(str).tolist()
    return [str(i + 1) for i in range(len(df))]


_CHURN_LABEL_COLS = {'Churn', 'churn', 'CHURN', 'churned',
                     'Churn Category', 'Churn Reason', 'Customer Status'}


@router.post("/upload/preview")
async def upload_preview(file: UploadFile = File(...)):
    """Step 1: parse CSV, run fuzzy mapping, return suggestions. No prediction yet."""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse CSV: {str(e)}")

    user_columns = [c for c in df.columns.tolist() if c not in _CHURN_LABEL_COLS]

    mapping = suggest_mapping(user_columns)
    summary = get_mapping_summary(mapping)

    return {
        "fileName": file.filename,
        "rowCount": len(df),
        "suggestedMapping": mapping,
        "summary": summary,
        "expectedFeatures": get_base_feature_names(),
    }


@router.post("/upload/confirm")
async def upload_confirm(file: UploadFile = File(...), mapping: str = Form(None)):
    """Step 2: receive confirmed mapping, preprocess, predict, return results."""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse CSV: {str(e)}")

    customer_ids = _extract_customer_ids(df)

    if mapping:
        try:
            confirmed_mapping = json.loads(mapping)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid mapping JSON")
        processed_df = preprocess_with_mapping(df, confirmed_mapping)
    else:
        from app.ml.preprocess import preprocess
        processed_df = preprocess(df)

    results = predict_from_processed(processed_df, customer_ids)

    total = len(results)
    if total == 0:
        raise HTTPException(status_code=400, detail="No valid rows found after processing")

    churners = sum(1 for r in results if r['riskLevel'] in ['Medium', 'High'])
    high_risk = sum(1 for r in results if r['riskLevel'] == 'High')
    medium_risk = sum(1 for r in results if r['riskLevel'] == 'Medium')
    low_risk = sum(1 for r in results if r['riskLevel'] == 'Low')

    summary = {
        "totalCustomers": total,
        "predictedChurners": churners,
        "churnRate": round(churners / total * 100, 2),
        "highRisk": high_risk,
        "mediumRisk": medium_risk,
        "lowRisk": low_risk
    }

    # Save to MongoDB 
    upload_id = await save_upload(
        file_name=file.filename,
        row_count=total,
        summary=summary,
        customers=results
    )

    return {
        "uploadId": upload_id,    
        "summary": summary,
        "customers": results
    }