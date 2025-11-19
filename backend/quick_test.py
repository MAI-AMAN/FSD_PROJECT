import joblib
import numpy as np

artifact = joblib.load("student_perf_model.joblib")
model = artifact['model']
cols = artifact['columns']
print("Model columns:", cols)

# sample input: attendance=85, study=3.5, internal=40, assignments=5, participation=2
x = np.array([85, 3.5, 40, 5, 2]).reshape(1, -1)
pred = int(model.predict(x)[0])
proba = float(model.predict_proba(x)[0][1])
print("Prediction:", pred, "Confidence:", round(proba,4))
