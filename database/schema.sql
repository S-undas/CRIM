-- CRIM Database Schema
-- SQLite

-- NOTE: Database integration is implemented in Iteration 3
-- This file will contain the following tables:

-- uploads table
-- Stores metadata about each CSV upload for trend analysis
-- Fields planned:
--   id INTEGER PRIMARY KEY AUTOINCREMENT
--   filename TEXT
--   upload_date TIMESTAMP
--   total_customers INTEGER
--   churn_rate REAL
--   high_risk INTEGER
--   medium_risk INTEGER
--   low_risk INTEGER