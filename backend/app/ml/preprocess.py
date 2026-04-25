import pandas as pd
import pickle
import os
from difflib import SequenceMatcher

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FEATURE_COLUMNS_PATH = os.path.join(BASE_DIR, 'models', 'feature_columns.pkl')

with open(FEATURE_COLUMNS_PATH, 'rb') as f:
    FEATURE_COLUMNS = pickle.load(f)

def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    df = df.drop(columns=['customerID'], errors='ignore') #so it doesn't crash if column doesn't exist

    # For TotalCharges, convert to number, replace blanks with 0
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df['TotalCharges'] = df['TotalCharges'].fillna(0)

    df = df.drop(columns=['Churn'], errors='ignore')

    # One hot encode all text columns
    categorical_cols = df.select_dtypes(include='object').columns.tolist()
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

    # Align the dataframe to match exactly what the model expects
    df = df.reindex(columns=FEATURE_COLUMNS, fill_value=0)

    return df

# Column Mapping Helpers (added for multi-dataset support)
def get_base_feature_names() -> list:
    """Extract original raw column names from one-hot encoded feature columns.
    e.g. 'gender_Male' -> 'gender', 'Contract_Two year' -> 'Contract'
    Numeric columns like 'tenure' are kept as-is.
    """
    base_names = set()
    for col in FEATURE_COLUMNS:
        if '_' in col:
            base_names.add(col.split('_')[0])
        else:
            base_names.add(col)
    return sorted(base_names)


def _similarity(a: str, b: str) -> float:
    """Case-insensitive fuzzy similarity ignoring spaces, underscores, hyphens."""
    def norm(s):
        return s.lower().replace(' ', '').replace('_', '').replace('-', '')
    return SequenceMatcher(None, norm(a), norm(b)).ratio()


def suggest_mapping(user_columns: list, threshold: float = 0.6) -> list:
    """For each user column find the best matching base feature name.
    Returns list of { userColumn, mappedTo } dicts. mappedTo is None if no match.
    """
    base_features = get_base_feature_names()
    result = []
    for user_col in user_columns:
        best_match, best_score = None, 0.0
        for base in base_features:
            score = _similarity(user_col, base)
            if score > best_score:
                best_score, best_match = score, base
        result.append({
            "userColumn": user_col,
            "mappedTo": best_match if best_score >= threshold else None
        })
    return result


def get_mapping_summary(mapping: list) -> dict:
    """Given a mapping list, return coverage stats."""
    base_features = get_base_feature_names()
    matched_bases = set(m["mappedTo"] for m in mapping if m["mappedTo"] is not None)
    extra = [m["userColumn"] for m in mapping if m["mappedTo"] is None]
    missing = [f for f in base_features if f not in matched_bases]
    coverage = round(len(matched_bases) / len(base_features) * 100, 1) if base_features else 0
    return {
        "matchedCount": len(matched_bases),
        "totalExpected": len(base_features),
        "coveragePercent": coverage,
        "extraColumns": extra,
        "missingFeatures": missing,
    }


def preprocess_with_mapping(df: pd.DataFrame, confirmed_mapping: list) -> pd.DataFrame:
    """Apply confirmed column mapping then run standard preprocessing pipeline."""
    # Drop churn-related columns (predicting, not training)
    churn_cols = ['Churn', 'churn', 'CHURN', 'churned',
                  'Churn Category', 'Churn Reason', 'Customer Status']
    df = df.drop(columns=[c for c in churn_cols if c in df.columns], errors='ignore')

    # Rename matched columns to their model equivalents
    # If multiple user columns map to the same target, keep only the first one
    # to avoid duplicate columns
    seen_targets = set()
    rename_map = {}
    cols_to_drop_dupes = []
    for m in confirmed_mapping:
        if m["mappedTo"] is None:
            continue
        if m["mappedTo"] in seen_targets:
            cols_to_drop_dupes.append(m["userColumn"])
        else:
            rename_map[m["userColumn"]] = m["mappedTo"]
            seen_targets.add(m["mappedTo"])

    df = df.drop(columns=cols_to_drop_dupes, errors='ignore')
    df = df.rename(columns=rename_map)

    # Drop unmatched (extra) columns
    keep = set(rename_map.values()) | set(FEATURE_COLUMNS)
    df = df[[c for c in df.columns if c in keep]]

    # Standard steps from here
    id_variants = ['customerID', 'CustomerID', 'customer_id', 'Customer ID',
                   'customerid', 'cust_id', 'Customer']
    df = df.drop(columns=[c for c in id_variants if c in df.columns], errors='ignore')

    if 'TotalCharges' in df.columns:
        df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce').fillna(0)

    categorical_cols = df.select_dtypes(include='object').columns.tolist()
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

    df = df.reindex(columns=FEATURE_COLUMNS, fill_value=0)
    return df