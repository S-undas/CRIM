import pandas as pd
import pickle
import os

FEATURE_COLUMNS_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'feature_columns.pkl')

with open(FEATURE_COLUMNS_PATH, 'rb') as f:
    FEATURE_COLUMNS = pickle.load(f)

def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    df = df.drop(columns=['customerID'], errors='ignore') #so it doesn't crash if column doesn't exist

    # For TotalCharges, convert to number, replace blanks with 0
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df['TotalCharges'] = df['TotalCharges'].fillna(0)

    df = df.drop(columns=['Churn'], errors='ignore')

    # One hot encode all text columns
    categorical_cols = df.select_dtypes(include='str').columns.tolist()
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

    # Align the dataframe to match exactly what the model expects
    df = df.reindex(columns=FEATURE_COLUMNS, fill_value=0)

    return df