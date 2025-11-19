// src/App.jsx
import React, { useState } from "react";
import "./App.css";
import Prism from "./components/Prism";
import MagicBento from "./components/MagicBento";

function App() {
  const [form, setForm] = useState({
    attendance_pct: "",
    study_hours: "",
    internal_marks: "",
    assignments_submitted: "",
    participation_score: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Flask backend URL
  const apiUrl = "http://127.0.0.1:5000/predict";

  // Handle changes from MagicBento inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const requiredFields = [
      "attendance_pct",
      "study_hours",
      "internal_marks",
      "assignments_submitted",
      "participation_score",
    ];

    for (const field of requiredFields) {
      if (form[field] === "") {
        setError("Please fill in all the fields.");
        return;
      }
    }

    const payload = {
      attendance_pct: parseFloat(form.attendance_pct),
      study_hours: parseFloat(form.study_hours),
      internal_marks: parseFloat(form.internal_marks),
      assignments_submitted: parseInt(form.assignments_submitted, 10),
      participation_score: parseInt(form.participation_score, 10),
    };

    setLoading(true);
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("API response:", data);

      if (!res.ok) {
        setError(
          data?.error
            ? `API Error: ${data.error}`
            : "Something went wrong with the API."
        );
        return;
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Request failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setForm({
      attendance_pct: "",
      study_hours: "",
      internal_marks: "",
      assignments_submitted: "",
      participation_score: "",
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="page-root">
      {/* Animated prism background */}
      <div className="bg-layer">
        <Prism
          animationType="rotate" // try "3drotate" or "hover" too
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0.1}
          glow={0.8}
        />
      </div>

      {/* Foreground content */}
      <div className="content-layer">
        <div className="app-shell">
          <header className="app-header">
            <h1>Student Performance Predictor</h1>
            <p>
              Enter a student&apos;s details and predict whether they will{" "}
              <strong>pass</strong> or <strong>fail</strong> using your ML model
              trained on 10,000 synthetic records.
            </p>
          </header>

          <main className="app-main">
            <div className="card">
              <form onSubmit={handleSubmit} className="form">
                {/* Bento layout for the 5 parameters */}
                <MagicBento
                  textAutoHide={true}
                  enableStars={true}
                  enableSpotlight={true}
                  enableBorderGlow={true}
                  enableTilt={true}
                  enableMagnetism={true}
                  clickEffect={true}
                  spotlightRadius={300}
                  particleCount={12}
                  glowColor="132, 0, 255"
                  form={form}
                  onFieldChange={handleChange}
                />

                <div className="button-row">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Predicting..." : "Predict"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                </div>
              </form>

              {error && <div className="alert-error">{error}</div>}

              {result && (
                <div className="result-card">
                  <h2 className="result-title">Prediction Result</h2>

                  <p className="result-line">
                    <span className="result-label">Prediction:</span>
                    <span
                      className={
                        "result-pill " +
                        (result.prediction === 1 ? "pass" : "fail")
                      }
                    >
                      {result.prediction === 1 ? "Pass" : "Fail"}
                    </span>
                  </p>

                  <p className="result-line">
                    <span className="result-label">Confidence:</span>
                    <span className="result-value">
                      {result.confidence !== undefined
                        ? (result.confidence * 100).toFixed(2) + "%"
                        : "N/A"}
                    </span>
                  </p>

                  <div className="details-block">
                    <details>
                      <summary>View input details</summary>
                      <pre className="details-pre">
                        {JSON.stringify(result.inputs || payload, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
