# CRIM API Documentation

Base URL: `http://localhost:8000`

---

## Endpoints

### GET /
Health check endpoint.

**Response:**
```json
{
  "message": "CRIM API is running"
}
```

---

### POST /api/upload

Upload a customer CSV file and receive churn predictions.

**Request:**
- Content-Type: multipart/form-data
- Body: CSV file field named `file`

**CSV Requirements:**
- Must contain Telco Customer Churn dataset columns
- Required columns include: customerID, tenure, Contract,
  MonthlyCharges, TotalCharges, InternetService, etc.

**Response:**
```json
{
  "summary": {
    "totalCustomers": 7043,
    "predictedChurners": 2093,
    "churnRate": 29.72,
    "highRisk": 1674,
    "mediumRisk": 419,
    "lowRisk": 4950
  },
  "customers": [
    {
      "customerID": "7590-VHVEG",
      "churnProbability": 0.31,
      "riskLevel": "Medium"
    }
  ]
}
```

**Error Response:**
```json
{
  "detail": "Only CSV files are allowed"
}
```

---

## Planned Endpoints (Iteration 2 & 3)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/customers/{id} | GET | Get individual customer profile |
| /api/shap/{id} | GET | Get SHAP explanation for a customer |
| /api/history | GET | Get previous upload history |
| /api/export/pdf | GET | Export results as PDF |
| /api/export/excel | GET | Export results as Excel |