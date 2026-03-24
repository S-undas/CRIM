# CRIM — Customer Churn Risk Identification and Management System

A web-based application that uses machine learning and explainable AI to predict customer churn risk and help businesses take proactive retention decisions.

---

## Description

Customer churn (i.e., the rate at which customers stop doing business with a company) is a major challenge for subscription-based businesses. CRIM addresses this by analyzing historical customer data, predicting the probability of churn for each customer, and categorizing them into risk levels. The system also explains *why* a customer is at risk, making the predictions transparent and trustworthy.

---

## Team Members

- Adeela Nasir (23L-0823)
- Hajirah (23L-0929)
- Sundas Habib (23L-2580)

---

## Features

- **CSV Data Upload** — Upload structured customer datasets for analysis
- **Churn Prediction Engine** — Random Forest classifier (TBD) that calculates churn probability per customer
- **Risk Categorization** — Automatically groups customers into Low, Medium, or High risk
- **Explainability (XAI)** — SHAP-based feature importance to explain predictions
- **Customer Profile View** — Detailed view of individual customer attributes and risk factors
- **Search & Filtering** — Filter customers by risk level, tenure, contract type, and more
- **Churn Summary Dashboard** — Overview of total customers, churn rate, and risk distribution
- **Report Generation** — Export results as PDF or Excel
- **Trend Analysis** — Compare current churn results with previous uploads

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite) |
| Backend | FastAPI (Python) |
| Machine Learning | Scikit-learn, SHAP |
| Data Processing | Pandas, NumPy |
| Visualization | Recharts, Matplotlib, Seaborn |
| Database | SQLite |
| Export | OpenPyXL, ReportLab |

---

## Project Structure

```
CRIM/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI app entry point
│   │   ├── database.py           # SQLite setup
│   │   ├── routes/
│   │   │   ├── upload.py         # CSV upload endpoint
│   │   │   └── predict.py        # Prediction endpoint
│   │   └── ml/
│   │       ├── preprocess.py     # Data cleaning & encoding
│   │       ├── model.py          # Load trained model
│   │       └── predict.py        # Run predictions & risk categorization
│   ├── models/
│   │   └── churn_model.pkl       # Saved trained model
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   |   │   |── Dashboard.jsx
│   |   │   └── TBD more pages 
│   │   ├── components/
│   │   │   ├── FileUpload.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   └── CustomerTable.jsx
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── erd.png
├── docs/
│   ├── report.docx
│   └── api-docs.md
├── notebooks/
│   ├── model_training.ipynb
│   └── data/
│       └── telco_churn.csv  # dataset from Kaggle
├── README.md
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+

### Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173` and the API at `http://localhost:8000`.

---

## Dataset

This project uses the Telco Customer Churn dataset sourced from Kaggle. It includes attributes such as customer tenure, service subscriptions, monthly charges, total charges, contract type, and churn labels.

---

## Development Plan

The project is built across 3 iterations:

| Iteration | Focus | Deliverable |
|-----------|-------|-------------|
| 1 | Core Prediction Module | Working churn prediction with basic dashboard |
| 2 | Analysis & Interaction Module | Customer profiles, XAI, filtering |
| 3 | Reporting & Finalization | Export, UI polish, testing, documentation |

---

## AI Techniques Used

- Supervised Machine Learning (Classification)
- Explainable AI (XAI) using SHAP values
- Predictive Analytics
- Feature Importance Analysis

---

## Authors

- [S-undas](https://github.com/S-undas)
- [adeela6](https://github.com/adeela6)
- [Hajirayyy](https://github.com/Hajirayyy)