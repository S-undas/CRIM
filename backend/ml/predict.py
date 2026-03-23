import pandas as pd
from .model import model
from .preprocess import preprocess

def get_risk_level(probability: float) -> str:
    # Declaring thresholds
    # Below 30% = Low Risk
    # 30% to 60% = Medium Risk  
    # Above 60% = High Risk
    if probability < 0.3:
        return "Low"
    elif probability < 0.6:
        return "Medium"
    else:
        return "High"

def predict_churn(df: pd.DataFrame) -> list:
    # Store customer IDs before preprocessing removes them
    # (need them to display in the frontend later)
    customer_ids = df['customerID'].tolist() if 'customerID' in df.columns else list(range(len(df)))

    processed_df = preprocess(df)

    # Returns probability for each class [not churn, churn]
    probabilities = model.predict_proba(processed_df)[:, 1]

    # Build result list - one entry per customer
    results = []
    for i, (customer_id, prob) in enumerate(zip(customer_ids, probabilities)):
        results.append({
            "customerID": customer_id,
            "churnProbability": round(float(prob), 4),
            "riskLevel": get_risk_level(prob)
        })

    return results