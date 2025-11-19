# app.py
from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
import sqlite3
from datetime import datetime
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Load model artifact
MODEL_PATH = "student_perf_model.joblib"
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Run train_model.py first.")

artifact = joblib.load(MODEL_PATH)
model = artifact['model']
COLUMNS = artifact['columns']  # e.g. ['attendance_pct', 'study_hours', ...]


# Initialize SQLite DB
DB = "predictions.db"
def init_db():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS predictions
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  attendance_pct REAL,
                  study_hours REAL,
                  internal_marks REAL,
                  assignments_submitted INTEGER,
                  participation_score INTEGER,
                  predicted INTEGER,
                  confidence REAL,
                  ts TEXT)''')
    conn.commit()
    conn.close()

init_db()


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json() or {}
    # Build row in right order and validate
    try:
        row = {col: data[col] for col in COLUMNS}
    except KeyError:
        return jsonify({"error": "Missing fields", "required": COLUMNS}), 400

    # Convert to DataFrame to avoid sklearn feature-name warning
    X = pd.DataFrame([row], columns=COLUMNS)

    # Predict
    pred = int(model.predict(X)[0])
    proba = model.predict_proba(X)[0]
    confidence = float(proba[1] if len(proba) > 1 else np.max(proba))

    # Log to sqlite
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''INSERT INTO predictions(attendance_pct,study_hours,internal_marks,assignments_submitted,participation_score,predicted,confidence,ts)
                 VALUES (?,?,?,?,?,?,?,?)''',
              (float(row['attendance_pct']),
               float(row['study_hours']),
               float(row['internal_marks']),
               int(row['assignments_submitted']),
               int(row['participation_score']),
               pred,
               confidence,
               datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()

    return jsonify({
        "prediction": pred,
        "confidence": round(confidence, 4),
        "inputs": row
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
