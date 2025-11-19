// src/App.jsx
import React, { useState } from "react";

function App() {
  const [form, setForm] = useState({
    attendance_pct: "",
    study_hours: "",
    internal_marks: "",
    assignments_submitted: "",
    participation_score: ""
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Your Flask API endpoint
  const apiUrl = "http://127.0.0.1:5000/predict";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Validate required fields
    const required = [
      "attendance_pct",
      "study_hours",
      "internal_marks",
      "assignments_submitted",
      "participation_score"
    ];

    for (let r of required) {
      if (form[r] === "") {
        setError("Please fill all fields.");
        return;
      }
    }

    const payload = {
      attendance_pct: parseFloat(form.attendance_pct),
      study_hours: parseFloat(form.study_hours),
      internal_marks: parseFloat(form.internal_marks),
      assignments_submitted: parseInt(form.assignments_submitted),
      participation_score: parseInt(form.participation_score)
    };

    setLoading(true);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log("API response:", data); // Debug log

      if (!res.ok) {
        setError("API Error: " + JSON.stringify(data));
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Request failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setForm({
      attendance_pct: "",
      study_hours: "",
      internal_marks: "",
      assignments_submitted: "",
      participation_score: ""
    });
    setResult(null);
    setError(null);
  };

  return (
    <div style={{ maxWidth: 760, margin: "30px auto", fontFamily: "Arial", padding: "0 12px" }}>
      <h1 style={{ textAlign: "center" }}>Student Performance Predictor</h1>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 20,
          background: "#222",
          color: "#fff",
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)"
        }}
      >
        <form onSubmit={submit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>
              Attendance %<br />
              <input
                name="attendance_pct"
                value={form.attendance_pct}
                onChange={handleChange}
                placeholder="e.g., 85"
                style={{ width: "100%", padding: 8 }}
                required
              />
            </label>

            <label>
              Study Hours (avg / day)<br />
              <input
                name="study_hours"
                value={form.study_hours}
                onChange={handleChange}
                placeholder="e.g., 3.5"
                style={{ width: "100%", padding: 8 }}
                required
              />
            </label>

            <label>
              Internal Marks (out of 50)<br />
              <input
                name="internal_marks"
                value={form.internal_marks}
                onChange={handleChange}
                placeholder="e.g., 40"
                style={{ width: "100%", padding: 8 }}
                required
              />
            </label>

            <label>
              Assignments Submitted<br />
              <input
                name="assignments_submitted"
                value={form.assignments_submitted}
                onChange={handleChange}
                placeholder="e.g., 5"
                style={{ width: "100%", padding: 8 }}
                required
              />
            </label>

            <label>
              Participation Score (0–3)<br />
              <input
                name="participation_score"
                value={form.participation_score}
                onChange={handleChange}
                placeholder="0, 1, 2, or 3"
                style={{ width: "100%", padding: 8 }}
                required
              />
            </label>
          </div>

          <div style={{ marginTop: 18 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                marginRight: 12,
                background: "#4CAF50",
                border: "none",
                color: "white",
                cursor: "pointer",
                borderRadius: 6
              }}
            >
              {loading ? "Predicting..." : "Predict"}
            </button>

            <button
              type="button"
              onClick={clear}
              style={{
                padding: "10px 20px",
                background: "#aaa",
                border: "none",
                cursor: "pointer",
                borderRadius: 6
              }}
            >
              Clear
            </button>
          </div>
        </form>

        {error && (
          <div
            style={{
              marginTop: 20,
              padding: 12,
              color: "#ffdddd",
              background: "#661111",
              borderRadius: 6
            }}
          >
            {error}
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 10,
              background: "#ffffff",
              color: "#111",
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)"
            }}
          >
            <h2 style={{ marginTop: 0 }}>Result</h2>

            <p>
              <strong>Prediction:</strong>{" "}
              <span>{result.prediction === 1 ? "Pass" : "Fail"}</span>
            </p>

            <p>
              <strong>Confidence:</strong>{" "}
              <span>{(result.confidence * 100).toFixed(2)}%</span>
            </p>

            <details style={{ marginTop: 10 }}>
              <summary style={{ cursor: "pointer", padding: 4 }}>Input values</summary>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  background: "#f4f4f4",
                  padding: 10,
                  borderRadius: 6,
                  marginTop: 10
                }}
              >
                {JSON.stringify(result.inputs, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
