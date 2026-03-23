import { useState } from "react";
import axios from "axios";

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
    const t = Number(formData.tenth);
    const tw = Number(formData.twelfth);
    return ((t + tw) / 2) * 1.2;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const iq = calculateIQ();
    const features = [
      iq, Number(formData.lastSem), Number(formData.cgpa),
      Number(formData.academic), Number(formData.internships),
      Number(formData.extracurricular), Number(formData.communication),
      Number(formData.projects)
    ];

    try {
      const res = await axios.post("http://localhost:5001/predict", { features });
      setResult(res.data.prediction === 1 ? "success" : "improve");
    } catch (err) {
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
        <div style={styles.leftPanel}>
          <div style={styles.brand}>
            <span style={styles.logoIcon}>✦</span>
            <span style={styles.logoText}>PathFinder AI</span>
          </div>
          <h1 style={styles.mainHeading}>Discover your <br/>placement <span style={{color: '#4f46e5'}}>potential.</span></h1>
          <p style={styles.description}>
            Our algorithm analyzes your academic and professional data to provide a personalized placement outlook.
          </p>
          
          {result && (
            <div style={{...styles.resultBox, 
              backgroundColor: result === 'success' ? '#f0fdf4' : result === 'improve' ? '#fffbeb' : '#fef2f2',
              borderColor: result === 'success' ? '#bbf7d0' : result === 'improve' ? '#fde68a' : '#fecaca'
            }}>
              <h4 style={{...styles.resultTitle, color: result === 'success' ? '#166534' : result === 'improve' ? '#92400e' : '#991b1b'}}>
                {result === 'success' ? "Sky's the Limit!" : result === 'improve' ? "Growth Opportunity" : "Service Interrupted"}
              </h4>
              <p style={{...styles.resultText, color: result === 'success' ? '#15803d' : result === 'improve' ? '#b45309' : '#b91c1c'}}>
                {result === 'success' 
                  ? "Your profile is exceptional! Recruiters value your balance of academics and skills. You're on the right track for a top-tier offer." 
                  : result === 'improve' 
                  ? "You have a solid foundation, but adding 1-2 more high-impact projects or certifications could significantly boost your odds." 
                  : "We're having trouble reaching the analysis engine. Please try again in a few moments."}
              </p>
            </div>
          )}
        </div>

        <div style={styles.rightPanel}>
          <div style={styles.formGrid}>
            {fields.map((f) => (
              <div key={f.id} style={styles.inputContainer}>
                <label style={styles.inputLabel}>{f.label}</label>
                <input 
                  name={f.id} 
                  placeholder="0" 
                  onChange={handleChange} 
                  style={styles.softInput}
                />
              </div>
            ))}
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            style={{...styles.primaryBtn, backgroundColor: loading ? '#9ca3af' : '#4f46e5'}}
          >
            {loading ? "Analyzing Profile..." : "Analyze My Profile"}
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
    background: "#f8fafc", // Soft off-white
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    padding: "20px"
  },
  card: {
    display: "flex",
    width: "100%",
    maxWidth: "1000px",
    background: "#ffffff",
    borderRadius: "32px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
    overflow: "hidden",
    border: "1px solid #f1f5f9"
  },
  leftPanel: {
    flex: 1,
    padding: "60px",
    background: "#fdfdfd",
    borderRight: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column"
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "40px"
  },
  logoIcon: {
    fontSize: "24px",
    color: "#4f46e5",
    fontWeight: "bold"
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: "-0.5px"
  },
  mainHeading: {
    fontSize: "36px",
    color: "#1e293b",
    lineHeight: "1.2",
    marginBottom: "20px",
    fontWeight: "800"
  },
  description: {
    color: "#64748b",
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "40px"
  },
  rightPanel: {
    flex: 1.2,
    padding: "60px",
    background: "#ffffff",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  inputLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569"
  },
  softInput: {
    padding: "12px 16px",
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s ease"
  },
  primaryBtn: {
    width: "100%",
    marginTop: "40px",
    padding: "16px",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)"
  },
  resultBox: {
    marginTop: "auto",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid",
    animation: "fadeIn 0.6s ease"
  },
  resultTitle: {
    margin: "0 0 8px 0",
    fontSize: "18px",
    fontWeight: "700"
  },
  resultText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.5"
  }
};

export default App;