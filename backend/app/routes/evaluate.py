from fastapi import APIRouter
from sklearn.metrics import (
    classification_report, confusion_matrix,
    accuracy_score, f1_score, roc_auc_score
)
from app.ml.model import model
import json, os, numpy as np

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEST_SET_PATH = os.path.join(BASE_DIR, 'models', 'test_set.json')

@router.get("/evaluate")
def evaluate_model():
    """
    Developer-only route. Returns model performance metrics on the held-out test set.
    NOT shown to end users — only for development, evaluation, and academic submission.
    """
    with open(TEST_SET_PATH, 'r') as f:
        data = json.load(f)

    X_test = np.array(data["X_test"])
    y_test = np.array(data["y_test"])

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    report = classification_report(y_test, y_pred,
                                   target_names=["No Churn", "Churn"],
                                   output_dict=True)
    cm = confusion_matrix(y_test, y_pred).tolist()

    return {
        "model_type": type(model).__name__,
        "test_set_size": len(y_test),
        "accuracy": round(accuracy_score(y_test, y_pred), 4),
        "roc_auc": round(roc_auc_score(y_test, y_prob), 4),
        "f1_churn_class": round(f1_score(y_test, y_pred), 4),
        "classification_report": report,
        "confusion_matrix": {
            "matrix": cm,
            "labels": ["No Churn", "Churn"]
        }
    }