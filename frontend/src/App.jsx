import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import confetti from "canvas-confetti";
import {
  BookOpen,
  Clock,
  Award,
  FileText,
  Activity,
  Zap,
  RotateCcw,
} from "lucide-react";
import "./App.css"; // Standard CSS import

// Configuration for the sliders
const FIELDS = [
  {
    name: "attendance_pct",
    label: "Attendance",
    icon: <Clock size={18} />,
    min: 0,
    max: 100,
    step: 1,
    suffix: "%",
    color: "#38bdf8", // Sky blue
  },
  {
    name: "study_hours",
    label: "Daily Study",
    icon: <BookOpen size={18} />,
    min: 0,
    max: 12, // Realistic max for UI
    step: 0.5,
    suffix: " hrs",
    color: "#a855f7", // Purple
  },
  {
    name: "internal_marks",
    label: "Internal Marks",
    icon: <Award size={18} />,
    min: 0,
    max: 30,
    step: 1,
    suffix: "/30",
    color: "#f472b6", // Pink
  },
  {
    name: "assignments_submitted",
    label: "Assignments",
    icon: <FileText size={18} />,
    min: 0,
    max: 20,
    step: 1,
    suffix: "",
    color: "#22c55e", // Green
  },
  {
    name: "participation_score",
    label: "Participation",
    icon: <Activity size={18} />,
    min: 0,
    max: 10,
    step: 1,
    suffix: "/10",
    color: "#facc15", // Yellow
  },
];

function App() {
  // State for form inputs
  const [form, setForm] = useState({
    attendance_pct: 75,
    study_hours: 2.5,
    internal_marks: 18,
    assignments_submitted: 10,
    participation_score: 5,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Real-time data calculation for the Radar Chart
  const chartData = [
    { subject: "Attendance", A: form.attendance_pct, fullMark: 100 },
    { subject: "Study", A: (form.study_hours / 12) * 100, fullMark: 100 },
    { subject: "Internals", A: (form.internal_marks / 30) * 100, fullMark: 100 },
    { subject: "Assign.", A: (form.assignments_submitted / 20) * 100, fullMark: 100 },
    { subject: "Particip.", A: (form.participation_score / 10) * 100, fullMark: 100 },
  ];

  // Handler for slider changes
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: parseFloat(value) }));
    // Reset result when user changes inputs to encourage re-prediction
    if (result) setResult(null);
  };

  // Confetti Animation Logic
  const triggerConfetti = () => {
    const end = Date.now() + 1000;
    const colors = ["#38bdf8", "#ffffff", "#22c55e"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Submit / Prediction Logic
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay (Use fetch here in real implementation)
    setTimeout(() => {
      // MOCK ALGORITHM FOR DEMO PURPOSES
      const score =
        form.attendance_pct * 0.4 +
        (form.internal_marks / 30) * 100 * 0.4 +
        (form.study_hours / 12) * 100 * 0.2;

      const isPass = score > 55; // Threshold for passing

      const mockResult = {
        prediction: isPass ? 1 : 0,
        confidence: isPass ? 0.85 + Math.random() * 0.1 : 0.92,
      };

      setResult(mockResult);
      setLoading(false);

      if (mockResult.prediction === 1) {
        triggerConfetti();
      }
    }, 1500);
  };

  return (
    <div className="page">
      {/* Background Elements */}
      <div className="bg-orb orb1" />
      <div className="bg-orb orb2" />
      <div className="noise-overlay" />

      <div className="app-container">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="header"
        >
          <div className="badge-pill">AI Powered v2.0</div>
          <h1 className="title">
            Student Success <span className="gradient-text">Predictor</span>
          </h1>
          <p className="subtitle">
            Analyze your academic footprint and forecast your results.
          </p>
        </motion.header>

        <div className="dashboard-grid">
          {/* LEFT PANEL: Control Inputs */}
          <motion.div
            className="card control-panel"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card-header">
              <h2>Input Metrics</h2>
              <button className="reset-btn" onClick={() => setResult(null)}>
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            <form onSubmit={submit} className="inputs-wrapper">
              {FIELDS.map((field) => (
                <div key={field.name} className="slider-group">
                  <div className="slider-label">
                    <div className="label-left" style={{ color: field.color }}>
                      {field.icon}
                      <span>{field.label}</span>
                    </div>
                    <span className="slider-value">
                      {form[field.name]}
                      <small>{field.suffix}</small>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={form[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="custom-range"
                    style={{ "--track-color": field.color }}
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className={`action-btn ${loading ? "loading" : ""}`}
              >
                {loading ? <span className="spinner" /> : <Zap size={20} />}
                {loading ? "Calculating Probability..." : "Run Prediction Model"}
              </button>
            </form>
          </motion.div>

          {/* RIGHT PANEL: Visualization & Results */}
          <motion.div
            className="card viz-panel"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Chart Section */}
            <div className="chart-container">
              <h3>Performance Radar</h3>
              <div className="radar-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    data={chartData}
                  >
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="Student"
                      dataKey="A"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill="#8b5cf6"
                      fillOpacity={0.4}
                      isAnimationActive={false} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Result Section */}
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`result-display ${
                    result.prediction === 1 ? "pass" : "fail"
                  }`}
                >
                  <div className="result-header">
                    <span className="label">Outcome Forecast</span>
                    <span className="confidence">
                      {(result.confidence * 100).toFixed(1)}% Confidence
                    </span>
                  </div>
                  <div className="result-main">
                    {result.prediction === 1 ? "PASS" : "AT RISK"}
                  </div>
                  <p className="result-desc">
                    {result.prediction === 1
                      ? "Great job! Your metrics indicate a strong probability of success. Keep maintaining this momentum."
                      : "Warning: Your current metrics suggest a high risk of failure. Focus on improving attendance and study hours immediately."}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  className="placeholder-state"
                >
                  <Activity size={48} />
                  <p>
                    Adjust sliders to see your academic shape. Click Predict to
                    get AI analysis.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;