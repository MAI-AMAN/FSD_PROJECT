# train_model.py
import pandas as pd
import numpy as np
import joblib
import os

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report

# Load dataset
data_path = os.path.join("..", "dataset", "student_data.csv")
print("Loading dataset from:", data_path)
df = pd.read_csv(data_path)
print("Rows:", len(df))

# Features & target
X = df[['attendance_pct','study_hours','internal_marks','assignments_submitted','participation_score']]
y = df['passed']
X = X.fillna(X.median())

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Grid search on RandomForest
param_grid = {
    'n_estimators': [50, 100],
    'max_depth': [5, 10, None],
    'min_samples_leaf': [1, 2]
}
rf = RandomForestClassifier(random_state=42)
grid = GridSearchCV(rf, param_grid, cv=4, scoring='accuracy', n_jobs=-1)
print("Starting GridSearchCV (may take a minute)...")
grid.fit(X_train, y_train)

best = grid.best_estimator_
print("Best params:", grid.best_params_)

# Evaluate
y_pred = best.predict(X_test)
y_proba = best.predict_proba(X_test)[:, 1]

print("Accuracy:", accuracy_score(y_test, y_pred))
print("ROC AUC:", roc_auc_score(y_test, y_proba))
print(classification_report(y_test, y_pred))

# Save artifact (model + feature column order)
artifact = {'model': best, 'columns': X.columns.tolist()}
joblib.dump(artifact, "student_perf_model.joblib")
print("Saved model to student_perf_model.joblib")
