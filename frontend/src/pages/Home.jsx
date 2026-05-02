import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // 🔐 check auth state
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);

    // FORCE UI RESET
    setSummary(null);
    setCustomers([]);
    setUploadId(null);
  };

  return (
    <div style={{ backgroundColor: "#0d0d14", minHeight: "100vh", fontFamily: "sans-serif", color: "#e8e9f0" }}>

      {/* Hero */}
      <div style={{ padding: "90px 24px 80px", textAlign: "center" }}>
        <div style={{ display: "inline-block", backgroundColor: "rgba(255,255,255,0.07)", color: "#9a9dc0", fontSize: "11px", fontWeight: "700", padding: "5px 16px", borderRadius: "20px", marginBottom: "28px", letterSpacing: "1.5px", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.08)" }}>
          Customer Retention Intelligence Model
        </div>

        <h1 style={{ fontSize: "48px", fontWeight: "800", color: "#fff", lineHeight: "1.1", marginBottom: "20px", maxWidth: "620px", marginLeft: "auto", marginRight: "auto" }}>
          Predict Churn.<br />Retain Customers.
        </h1>

        <p style={{ fontSize: "16px", color: "#7a7d9a", maxWidth: "500px", margin: "0 auto 40px", lineHeight: "1.75" }}>
          CRIM helps businesses identify at-risk customers before they leave — using AI, clean dashboards, and zero complexity.
        </p>

        {/* 🔐 ONLY CTA UPDATED */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>

          {!token ? (
            <>
              <button
                onClick={() => navigate("/signup")}
                style={{
                  padding: "12px 28px",
                  backgroundColor: "#22d3a0",
                  color: "#0d0d14",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Upload Your Data →
              </button>

              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "12px 28px",
                  backgroundColor: "transparent",
                  color: "#ccc",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Login
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/uploads")}
                style={{
                  padding: "12px 28px",
                  backgroundColor: "#22d3a0",
                  color: "#0d0d14",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Upload Your Data →
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                style={{
                  padding: "12px 28px",
                  backgroundColor: "transparent",
                  color: "#ccc",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                View Dashboard
              </button>

              <button
                onClick={handleLogout}
                style={{
                  padding: "12px 28px",
                  backgroundColor: "transparent",
                  color: "#ff7a7a",
                  border: "1px solid rgba(255,122,122,0.3)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>

      {/* 🔽 EVERYTHING BELOW IS EXACTLY YOUR ORIGINAL CODE (UNCHANGED) */}

      {/* Why businesses lose customers */}
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px 72px" }}>
        <div style={{ backgroundColor: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "48px 40px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#fff", marginBottom: "16px", textAlign: "center" }}>
            Why businesses lose customers
          </h2>
          <p style={{ fontSize: "14px", color: "#6a6d88", lineHeight: "1.85", textAlign: "center", maxWidth: "620px", margin: "0 auto 36px" }}>
            Most small and medium businesses only realize customers are leaving after it's too late.
            They can't afford expensive CRM systems, their data lives in spreadsheets, and they have
            no data team to build prediction models. CRIM solves all of that — for free.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
            {[
              { icon: "💸", title: "Expensive CRMs", desc: "Enterprise tools cost thousands — out of reach for most SMBs." },
              { icon: "📊", title: "Data in Spreadsheets", desc: "No structure. No insight. Just rows that don't tell you who's leaving." },
              { icon: "🔍", title: "No Data Team", desc: "Building ML models in-house isn't realistic without dedicated engineers." },
              { icon: "⏰", title: "Too Late to Act", desc: "By the time churn is noticed, the customer is already gone." },
            ].map((item) => (
              <div key={item.title} style={{ backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "20px 16px" }}>
                <div style={{ fontSize: "22px", marginBottom: "10px" }}>{item.icon}</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#e0e2f0", marginBottom: "6px" }}>{item.title}</div>
                <div style={{ fontSize: "12px", color: "#5a5d78", lineHeight: "1.6" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#fff", textAlign: "center", marginBottom: "36px" }}>
          How it works
        </h2>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0", alignItems: "flex-start" }}>
          {[
            { step: "1", title: "Upload CSV", desc: "Import your customer dataset in one click" },
            { step: "2", title: "AI Analyzes", desc: "ML model scores each customer's churn risk" },
            { step: "3", title: "View Results", desc: "See risk levels, charts, and profiles" },
            { step: "4", title: "Export Report", desc: "Download findings as PDF or Excel" },
          ].map((s, i, arr) => (
            <div key={s.step} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ textAlign: "center", width: "155px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: i === 0 ? "#22d3a0" : "#1a1a2e", border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.1)", color: i === 0 ? "#0d0d14" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", margin: "0 auto 12px" }}>
                  {s.step}
                </div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#e0e2f0", marginBottom: "6px" }}>{s.title}</div>
                <div style={{ fontSize: "11px", color: "#5a5d78", lineHeight: "1.5" }}>{s.desc}</div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ width: "36px", height: "1px", backgroundColor: "rgba(255,255,255,0.1)", margin: "0 4px", flexShrink: 0, marginBottom: "32px" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "0 24px 80px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#fff", marginBottom: "10px" }}>
          Ready to get started?
        </h2>

        <p style={{ fontSize: "13px", color: "#5a5d78", marginBottom: "24px" }}>
          Upload your customer CSV and see who's at risk in seconds.
        </p>

        {!token ? (
          <button
            onClick={() => navigate("/signup")}
            style={{
              padding: "12px 32px",
              backgroundColor: "#22d3a0",
              color: "#0d0d14",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Get Started (Signup)
          </button>
        ) : (
          <button
            onClick={() => navigate("/uploads")}
            style={{
              padding: "12px 32px",
              backgroundColor: "#22d3a0",
              color: "#0d0d14",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Upload Your Data →
          </button>
        )}
      </div>

    </div>
  );
};

export default Home;