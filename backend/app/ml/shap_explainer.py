import shap
import pandas as pd
import numpy as np
import os
import math

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BACKGROUND_PATH = os.path.join(BASE_DIR, 'models', 'background_sample.csv')

_explainer = None

def _load_explainer(model):
    global _explainer
    if _explainer is None:
        background = pd.read_csv(BACKGROUND_PATH).astype(np.float32)

        def predict_churn_proba(X):
            return model.predict_proba(X)[:, 1]

        _explainer = shap.Explainer(predict_churn_proba, background, max_evals=100)
        print("[CRIM] SHAP explainer initialized")
    return _explainer

def safe_float(v):
    if math.isnan(v) or math.isinf(v):
        return 0.0
    return v

def get_shap_values(model, processed_df: pd.DataFrame) -> list:
    explainer = _load_explainer(model)
    shap_values = explainer(processed_df.astype(np.float32))
    shap_array = shap_values.values
    feature_names = processed_df.columns.tolist()
    results = []

    for i in range(len(processed_df)):
        contributions = [
            {
                "feature": feature_names[j],
                "value": safe_float(float(processed_df.iloc[i, j])),
                "shapValue": safe_float(float(shap_array[i, j]))
            }
            for j in range(len(feature_names))
        ]
        contributions.sort(key=lambda x: abs(x["shapValue"]), reverse=True)
        results.append(contributions[:5])

    return results