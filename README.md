🌟 Student Performance Predictor

A modern ML-powered web app that predicts a student’s academic outcome (Pass / Fail) based on performance indicators like attendance, study hours, internal marks, assignments, and participation.

Built with React (Frontend) + Flask API + Machine Learning Model trained on 10,000 synthetic records.

🚀 Features

✔ Clean & Minimal UI
✔ Real-time Predictions (Flask API)
✔ Machine Learning model trained using synthetic dataset
✔ Confidence Scoring
✔ Scalable dataset (regenerate & retrain anytime)
✔ SQLite logging for predictions

🔧 Tech Stack
Layer	Technology
Frontend	React (Vite), CSS
Backend	Flask, Python
ML Model	Scikit-Learn, Pandas, NumPy
DB	SQLite
Version Control	Git + GitHub
📂 Project Structure
FSD_PROJECT/
├── backend/
│   ├── app.py                # Flask API
│   ├── train_model.py        # Model training script
│   ├── student_perf_model.joblib
│   ├── predictions.db        # Logs predictions
│
├── dataset/
│   ├── generate_dataset.py   # Generates synthetic dataset
│   └── student_data.csv
│
└── frontend/
    ├── src/                  # React code
    └── package.json

⚙️ Setup & Installation
📌 1️⃣ Backend Setup
cd backend
pip install -r requirements.txt
python app.py


Runs at:

http://127.0.0.1:5000

📌 2️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Runs at:

http://localhost:5173

📡 API Usage

POST → /predict

Request
{
  "attendance_pct": 85,
  "study_hours": 3.5,
  "internal_marks": 42,
  "assignments_submitted": 6,
  "participation_score": 2
}

Response
{
  "prediction": 1,
  "confidence": 0.92
}


📌 1 = Pass, 0 = Fail

🧠 Training New Data

Generate new dataset:

cd dataset
python generate_dataset.py


Retrain model:

cd backend
python train_model.py


Model auto-exports to:

backend/student_perf_model.joblib

🌱 Git Workflow
Action	Command
Create new branch	git switch -c ui-redesign
Change branch	git switch main
Push work	git push origin branch-name
Check branches	git branch
Last branch	git switch -
🛣 Roadmap

⏳ Graph-based results visualization

⏳ Dark mode UI upgrade

⏳ Real student data pipeline

⏳ Authentication + dashboards

If you'd like, I can also design:
✔ A dashboard page
✔ Animated result visualization
