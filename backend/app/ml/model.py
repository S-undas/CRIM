import pickle
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'churn_model.pkl')

# Load model here at module level so it's not reloaded on every request
with open(MODEL_PATH, 'rb') as f:
    model = pickle.load(f)

# Confirm what is loaded
print(f"[CRIM] Model loaded: {type(model).__name__}")