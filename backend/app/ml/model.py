import pickle
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'churn_model.pkl')

# Load model here at module level so it's not reloaded on every request
with open(MODEL_PATH, 'rb') as f:
    model = pickle.load(f)