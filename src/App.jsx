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
      const res = await axios.post(`${BACKEND_URL}/predict`, { features });
      if (res.data && res.data.prediction !== undefined) {
        setResult(res.data.prediction === 1 ? "success" : "improve");
      } else {
        setResult("error");
      }
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
    { id: "internships", label: "Internships" },
    { id: "extracurricular", label: "Activities (1-10)" },
    { id: "communication", label: "Soft Skills (1-10)" },
    { id: "projects", label: "Projects" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        
        * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .app-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 1rem;
        }

        .main-card {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 1100px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          border: 1px solid white;
        }

        .left-panel {
          padding: 2rem;
          background: #fafafa;
          border-bottom: 1px solid #e2e8f0;
        }

        .right-panel {
          padding: 2rem;
          background: #ffffff;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .input-group input {
          padding: 0.75rem 1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s;
          outline: none;
        }

        .input-group input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        .submit-btn {
          width: 100%;
          margin-top: 2rem;
          padding: 1rem;
          border-radius: 12px;
          border: none;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }

        .submit-btn:active { transform: scale(0.98); }

        .result-box {
          margin-top: 1.5rem;
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid;
          animation: slideUp 0.4s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
          margin-right: 10px;
          vertical-align: middle;
        }

        /* Desktop Layout Override */
        @media (min-width: 900px) {
          .main-card { flex-direction: row; }
          .left-panel { flex: 1; border-bottom: none; border-right: 1px solid #e2e8f0; padding: 4rem; }
          .right-panel { flex: 1.2; padding: 4rem; }
          .form-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="app-container">
        <main className="main-card">
          <section className="left-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
              <span style={{ fontSize: '24px', color: '#4f46e5' }}>✦</span>
              <b style={{ color: '#1e293b' }}>PathFinder AI</b>
            </div>
            
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Your future, <br/><span style={{ color: '#4f46e5' }}>predicted.</span>
            </h1>
            
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
              Enter your academic and professional details. Our neural network will evaluate your profile against current industry hiring trends.
            </p>

            <div className="result-container">
              {!result && !loading && (
                <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  Complete the form to see your placement outlook.
                </p>
              )}

              {loading && (
                <div style={{ color: '#4f46e5', fontWeight: 600 }}>
                  <div className="spinner" style={{ borderTopColor: '#4f46e5' }}></div>
                  Analyzing profile...
                </div>
              )}

              {result && !loading && (
                <div className="result-box" style={{
                  backgroundColor: result === 'success' ? '#f0fdf4' : result === 'improve' ? '#fffbeb' : '#fef2f2',
                  borderColor: result === 'success' ? '#bbf7d0' : result === 'improve' ? '#fde68a' : '#fecaca',
                  color: result === 'success' ? '#166534' : result === 'improve' ? '#92400e' : '#991b1b'
                }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>
                    {result === 'success' ? "✨ Excellent Profile" : result === 'improve' ? "📈 Growth Path" : "⚠️ Connection Error"}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9 }}>
                    {result === 'success' 
                      ? "You are highly likely to get placed! Your stats are well above the industry average for top companies." 
                      : result === 'improve' 
                      ? "You have a solid base. Strengthening your projects or internship count could push you into the top 10% of candidates." 
                      : "We couldn't reach the server. Please try again in a moment."}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="right-panel">
            <form onSubmit={handleSubmit} className="form-grid">
              {fields.map((f) => (
                <div key={f.id} className="input-group">
                  <label htmlFor={f.id}>{f.label}</label>
                  <input
                    id={f.id}
                    name={f.id}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData[f.id]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </form>
            <button 
              className="submit-btn"
              onClick={handleSubmit}
              disabled={loading}
              style={{ backgroundColor: loading ? '#94a3b8' : '#4f46e5' }}
            >
              {loading ? <><div className="spinner"></div>Working...</> : "Generate AI Report"}
            </button>
          </section>
        </main>
      </div>
    </>
  );
}

export default App;