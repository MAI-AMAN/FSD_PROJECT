import pandas as pd
import numpy as np

n = 300
np.random.seed(42)

attendance = np.clip(np.random.normal(75,15,n), 30, 100).round(1)
study_hours = np.clip(np.random.normal(2.5,1.2,n), 0.0, 8.0).round(2)
internal_marks = np.clip(np.random.normal(35,8,n), 0, 50).round(0)
assignments = np.clip(np.random.poisson(4, n), 0, 10)
participation = np.random.choice([0,1,2,3], size=n, p=[0.1,0.3,0.4,0.2])

score = 0.4*(attendance/100) + 0.4*(internal_marks/50) + 0.2*(study_hours/6)
passed = (score + (assignments/10)*0.05 + (participation/3)*0.05) > 0.5

df = pd.DataFrame({
    'attendance_pct': attendance,
    'study_hours': study_hours,
    'internal_marks': internal_marks,
    'assignments_submitted': assignments,
    'participation_score': participation,
    'passed': passed.astype(int)
})
df.to_csv("student_data.csv", index=False)
print("Dataset created successfully!")
