# 📘 Student Performance Predictor — Final Report

## 🏫 Project Title  
**Student Performance Predictor Using Machine Learning**

## 👥 Team Members  
| Name | Role | Branch |
|------|------|--------|
| Harsh | Frontend + UI/UX | CMRIT |
| Aman | Backend + Model | CMRIT |
| Antariksh | Integration + DevOps | CMRIT |

---

## 1️⃣ **Introduction**

Student performance evaluation in colleges is typically manual, biased, and lacks data-based forecasting. The *Student Performance Predictor* solves this problem by predicting whether a student will **Pass** or **Fail** using multiple academic and behavioral factors.

The system is powered by:
- **Machine Learning (Random Forest Classifier)**
- **React-based UI**
- **Flask backend for predictions**
- **Synthetic dataset of 10,000 records**

This provides institutions insights into early intervention for at-risk students.

---

## 2️⃣ **Problem Statement**

Colleges lack a system to proactively identify students who:
- Might struggle academically
- Require remedial sessions
- Need personalized learning support

Traditional grading predicts performance only *after exams*, not before.

**Goal:** Predict outcomes early and provide insights proactively.

---

## 3️⃣ **Objectives**

| Objective | Status |
|-----------|--------|
| Generate large synthetic student dataset | ✔ Completed |
| Train ML model using performance metrics | ✔ Completed |
| Build REST API for prediction | ✔ Completed |
| Design clean UI for parameter input | ✔ Completed |
| Display prediction with confidence score | ✔ Completed |

---

## 4️⃣ **System Architecture**

┌─────────┐ ┌─────────────┐ ┌─────────────┐
│ Frontend │ ---> │ Flask API │ ---> │ ML Model │
│ (React) │ │ /predict │ │ RandomForest │
└─────────┘ └─────────────┘ └─────────────┘

yaml
Copy code

**Flow:**
User enters input → API receives JSON → Model predicts → Response sent back.

---

## 5️⃣ **Tech Stack**

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + CSS |
| Backend | Flask + Python |
| ML Model | RandomForestClassifier |
| Data | Pandas + NumPy + Joblib |
| Storage | SQLite for logging inputs |

---

## 6️⃣ **Dataset**

- **Records:** 10,000 synthetic samples  
- **Generated using:** Normal + Poisson + Random distributions  
- **Features Used:**

| Feature | Type | Description |
|---------|------|-------------|
| attendance_pct | Numerical | Average attendance percentage |
| study_hours | Numerical | Daily study average |
| internal_marks | Numerical | Marks out of 50 |
| assignments_submitted | Numerical | Completed assignments |
| participation_score | Categorical | Class interaction (0–3) |

Example schema:

```csv
attendance_pct,study_hours,internal_marks,assignments_submitted,participation_score,passed
82.5,3.5,40,6,2,1
7️⃣ Model Details
Parameter	Value
Algorithm	RandomForestClassifier
Training Size	80%
Testing Size	20%
Accuracy	~94%

Evaluation Metrics:

yaml
Copy code
Precision: 0.93
Recall: 0.91
F1 Score: 0.92
8️⃣ Backend API
🔹 Endpoint
POST /predict

Request (JSON)
json
Copy code
{
  "attendance_pct": 85,
  "study_hours": 3,
  "internal_marks": 42,
  "assignments_submitted": 6,
  "participation_score": 2
}
Response
json
Copy code
{
  "prediction": 1,
  "confidence": 0.934
}
9️⃣ Frontend UI
The UI follows a minimal dashboard layout consisting of:

Responsive navbar

Grid layout for 5 input parameters

Dotted bordered input sections

Hover animations + clean typography

Dark text on light background for clarity

User Interaction Flow:

Enter values

Click Predict

Result displayed as:

PASS / FAIL badge

Confidence percentage

Breakdown of inputs

🔟 Results & Interpretation
Example Output:

Input Values	Output	Confidence
Att: 82, Marks: 42	Pass	93%
Att: 50, Marks: 28	Fail	71%

Insight:

Internal marks and attendance contribute highest weightage.

Low assignment completion reduces confidence.

🔧 Future Enhancements
Feature	Description
Graph-based result visualization	Line/Pie/Bar charts
Admin dashboard	Track semesters & batches
Real-time student data ingestion	From ERP or LMS
Add more ML models	XGBoost, Neural Networks
