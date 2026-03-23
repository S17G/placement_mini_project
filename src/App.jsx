import { useState } from "react";
import axios from "axios";

const BACKEND_URL = "https://placement-api-dgtk.onrender.com";

function App() {
  const [formData, setFormData] = useState({
    tenth: "", twelfth: "", lastSem: "", cgpa: "",
    academic: "", internships: "", extracurricular: "",
    communication: "", projects: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateIQ = () => {
    const t = Number(formData.tenth) || 0;
    const tw = Number(formData.twelfth) || 0;
    return ((t + tw) / 2) * 1.2;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setResult(null);

    const iq = calculateIQ();
    const features = [
      iq, 
      Number(formData.lastSem) || 0, 
      Number(formData.cgpa) || 0,
      Number(formData.academic) || 0, 
      Number(formData.internships) || 0,
      Number(formData.extracurricular) || 0, 
      Number(formData.communication) || 0,
      Number(formData.projects) || 0
    ];

    try {
      // Calling your Live Render Backend
      const res = await axios.post(`${BACKEND_URL}/predict`, { features });
      
      if (res.data && res.data.prediction !== undefined) {
        setResult(res.data.prediction === 1 ? "success" : "improve");
      } else {
        setResult("error");
      }
    } catch (err) {
      console.error("API Error:", err);
      setResult("error");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: "tenth", label: "10th Score (%)" },
    { id: "twelfth", label: "12th Score (%)" },
    { id: "lastSem", label: "Last Sem SGPA" },
    { id: "cgpa", label: "Current CGPA" },
    { id: "academic", label: "Academic Rank (1-10)" },
    { id: "internships", label: "Internships Done" },
    { id: "extracurricular", label: "Extra-Curricular" },
    { id: "communication", label: "Soft Skills (1-10)" },
    { id: "projects", label: "Projects Completed" },
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Left Panel: Status & Results */}
        <div style={styles.leftPanel}>
          <div style={styles.brand}>
            <span style={styles.logoIcon}>✦</span>
            <span style={styles.logoText}>PathFinder AI</span>
          </div>
          <h1 style={styles.mainHeading}>Discover your <br/>placement <span style={{color: '#4f46e5'}}>potential.</span></h1>
          <p style={styles.description}>
            Our AI model analyzes your profile against thousands of historical data points to predict your career trajectory.
          </p>
          
          <div style={styles.resultArea}>
            {!result && !loading && (
              <div style={styles.placeholder}>Enter your details to generate a report.</div>
            )}

            {loading && (
              <div style={styles.loadingBox}>
                <div style={styles.spinner}></div>
                <p>AI is analyzing your profile...</p>
                <small style={{color: '#94a3b8'}}>Initial wake-up may take ~30 seconds</small>
              </div>
            )}

            {result && !loading && (
              <div style={{...styles.resultBox, 
                backgroundColor: result === 'success' ? '#f0fdf4' : result === 'improve' ? '#fffbeb' : '#fef2f2',
                borderColor: result === 'success' ? '#bbf7d0' : result === 'improve' ? '#fde68a' : '#fecaca'
              }}>
                <h4 style={{...styles.resultTitle, color: result === 'success' ? '#166534' : result === 'improve' ? '#92400e' : '#991b1b'}}>
                  {result === 'success' ? "Sky's the Limit!" : result === 'improve' ? "Growth Opportunity" : "Service Error"}
                </h4>
                <p style={{...styles.resultText, color: result === 'success' ? '#15803d' : result === 'improve' ? '#b45309' : '#b91c1c'}}>
                  {result === 'success' 
                    ? "Your profile is exceptional! You demonstrate a strong balance of academics and practical skills. You're in a great position for top-tier placements." 
                    : result === 'improve' 
                    ? "You're on your way! To increase your odds, focus on building 1-2 more specialized projects or improving your technical certifications." 
                    : "Something went wrong. Please ensure the backend server is active and try again."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Form Inputs */}
        <div style={styles.rightPanel}>
          <div style={styles.formGrid}>
            {fields.map((f) => (
              <div key={f.id} style={styles.inputContainer}>
                <label style={styles.inputLabel}>{f.label}</label>
                <input 
                  name={f.id} 
                  type="number"
                  placeholder="0" 
                  value={formData[f.id]}
                  onChange={handleChange} 
                  style={styles.softInput}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            style={{
              ...styles.primaryBtn, 
              backgroundColor: loading ? '#9ca3af' : '#4f46e5',
              cursor: loading ? 'wait' : 'pointer'
            }}
          >
            {loading ? "Processing..." : "Generate Analysis"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
    fontFamily: "'Inter', sans-serif",
    padding: "20px"
  },
  card: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    maxWidth: "1050px",
    background: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  leftPanel: {
    flex: 1,
    minWidth: "350px",
    padding: "50px",
    background: "#fafafa",
    borderRight: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column"
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "30px"
  },
  logoIcon: { fontSize: "22px", color: "#4f46e5", fontWeight: "bold" },
  logoText: { fontSize: "16px", fontWeight: "700", color: "#1e293b" },
  mainHeading: { fontSize: "32px", color: "#1e293b", fontWeight: "800", marginBottom: "15px" },
  description: { color: "#64748b", fontSize: "15px", lineHeight: "1.6", marginBottom: "30px" },
  resultArea: { marginTop: "auto", minHeight: "150px", display: "flex", alignItems: "center" },
  placeholder: { color: "#cbd5e1", fontSize: "14px", fontStyle: "italic", textAlign: "center", width: "100%" },
  rightPanel: { flex: 1.2, minWidth: "350px", padding: "50px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  inputContainer: { display: "flex", flexDirection: "column", gap: "6px" },
  inputLabel: { fontSize: "12px", fontWeight: "600", color: "#475569", textTransform: "uppercase" },
  softInput: {
    padding: "12px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s"
  },
  primaryBtn: {
    width: "100%",
    marginTop: "30px",
    padding: "15px",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.3s ease"
  },
  resultBox: { padding: "20px", borderRadius: "16px", border: "1px solid", width: "100%" },
  resultTitle: { margin: "0 0 5px 0", fontSize: "16px", fontWeight: "700" },
  resultText: { margin: 0, fontSize: "13px", lineHeight: "1.5" },
  loadingBox: { textAlign: "center", width: "100%" },
  spinner: {
    width: "30px", height: "30px", border: "3px solid #f3f3f3", borderTop: "3px solid #4f46e5",
    borderRadius: "50%", margin: "0 auto 10px", animation: "spin 1s linear infinite"
  }
};

// Add this to your Global CSS or Index.css
// @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

export default App;