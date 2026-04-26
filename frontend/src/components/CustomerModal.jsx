import { useState, useEffect } from "react";

const BASE_URL = "http://127.0.0.1:8000/api";

const getRiskStyle = (level) => {
  if (level === "High")   return { color: "var(--high)",   bg: "var(--high-bg)" };
  if (level === "Medium") return { color: "var(--medium)", bg: "var(--medium-bg)" };
  return { color: "var(--low)", bg: "var(--low-bg)" };
};

const formatFeatureName = (name) => {
  if (name.includes("_")) {
    const [base, ...rest] = name.split("_");
    const baseFormatted = base.replace(/([A-Z])/g, " $1").trim();
    const valueFormatted = rest.join(" ");
    return `${baseFormatted}: ${valueFormatted}`;
  }
  return name.replace(/([A-Z])/g, " $1").trim();
};

const ShapBar = ({ feature, shapValue, value }) => {
  const isPositive = shapValue > 0;
  const maxBar = 100;
  const barWidth = Math.min(Math.abs(shapValue) * 400, maxBar);
  const color = isPositive ? "#f87171" : "#34d399";

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 500 }}>
          {formatFeatureName(feature)}
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
          val: {typeof value === "number" && !Number.isInteger(value) ? value.toFixed(2) : value}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: maxBar, display: "flex", justifyContent: "flex-end" }}>
          {!isPositive && (
            <div style={{
              height: 8, width: barWidth, background: color,
              borderRadius: "4px 0 0 4px", opacity: 0.85, transition: "width 0.5s ease",
            }} />
          )}
        </div>
        <div style={{ width: 1, height: 16, background: "var(--border)", flexShrink: 0 }} />
        <div style={{ width: maxBar }}>
          {isPositive && (
            <div style={{
              height: 8, width: barWidth, background: color,
              borderRadius: "0 4px 4px 0", opacity: 0.85, transition: "width 0.5s ease",
            }} />
          )}
        </div>
        <span style={{ fontSize: "0.72rem", color, whiteSpace: "nowrap", minWidth: 110 }}>
          {isPositive ? "↑ increases risk" : "↓ decreases risk"}
        </span>
      </div>
    </div>
  );
};

const CustomerModal = ({ customer, onClose, uploadId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [recsLoading, setRecsLoading] = useState(false);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (!customer || customer.riskLevel === "Low" || !uploadId) return;
    setRecommendations([]);
    setRecsLoading(true);
    fetch(`${BASE_URL}/recommendations/${uploadId}/${customer.customerID}`)
      .then((r) => r.json())
      .then((data) => setRecommendations(data.recommendations || []))
      .catch(() => setRecommendations([]))
      .finally(() => setRecsLoading(false));
  }, [customer?.customerID, uploadId]);

  if (!customer) return null;

  const risk = getRiskStyle(customer.riskLevel);
  const pct = (customer.churnProbability * 100).toFixed(1);
  const shap = customer.shapExplanation || [];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        overflowY: "auto",         // overlay scrolls, not the card
        zIndex: 1000,
        animation: "fadeIn 0.2s ease",
        padding: "40px 20px",
      }}
    >
      {/* This inner wrapper is what centers the card and moves with scroll */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100%",
      }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "32px",
            width: "100%",
            maxWidth: "880px",
            animation: "fadeUp 0.25s ease",
            boxShadow: "var(--shadow)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "4px" }}>
                Customer Details
              </p>
              <h2 style={{ fontSize: "1.4rem" }} className="mono">#{customer.customerID}</h2>
            </div>
            <button onClick={onClose} className="btn btn-secondary" style={{ padding: "6px 12px" }}>✕</button>
          </div>

          {/* Top row — Churn Meter + Risk Badge side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {/* Churn Meter */}
            <div style={{
              background: "var(--bg-elevated)", borderRadius: "var(--radius)",
              padding: "20px", border: "1px solid var(--border-subtle)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Churn Probability</span>
                <span className="mono" style={{ fontSize: "1.2rem", fontWeight: 700, color: risk.color }}>
                  {pct}%
                </span>
              </div>
              <div style={{ height: 10, background: "var(--border)", borderRadius: 5, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${pct}%`,
                  background: `linear-gradient(90deg, ${risk.color}88, ${risk.color})`,
                  borderRadius: 5, transition: "width 0.6s ease",
                }} />
              </div>
            </div>

            {/* Risk Badge */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px", background: risk.bg,
              border: `1px solid ${risk.color}33`, borderRadius: "var(--radius)",
            }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Risk Level</span>
              <span style={{
                fontWeight: 700, fontSize: "1.1rem",
                color: risk.color, textTransform: "uppercase", letterSpacing: "0.05em"
              }}>{customer.riskLevel}</span>
            </div>
          </div>

          {/* Bottom row — SHAP + Recommendations side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20, alignItems: "stretch" }}>

            {/* SHAP Explanation */}
            {shap.length > 0 && (
              <div style={{
                background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius)", padding: "20px",
              }}>
                <p style={{ margin: "0 0 4px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Why this prediction?
                </p>
                <p style={{ margin: "0 0 14px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Top factors influencing churn risk
                </p>
                <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                  <span style={{ fontSize: "0.72rem", color: "#34d399", display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: "#34d399" }} />
                    Reduces risk
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#f87171", display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: "#f87171" }} />
                    Increases risk
                  </span>
                </div>
                {shap.map((s, i) => (
                  <ShapBar key={i} feature={s.feature} shapValue={s.shapValue} value={s.value} />
                ))}
              </div>
            )}

            {/* Recommendations */}
            {customer.riskLevel !== "Low" && (
              <div style={{
                background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius)", padding: "20px",
              }}>
                <p style={{ margin: "0 0 4px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Retention Recommendations
                </p>
                <p style={{ margin: "0 0 14px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  AI-generated actions based on risk factors
                </p>

                {recsLoading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: "50%",
                      border: "2px solid rgba(56,189,248,0.2)",
                      borderTop: "2px solid rgba(56,189,248,0.7)",
                      animation: "spin 0.8s linear infinite",
                    }} />
                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      Generating recommendations…
                    </span>
                  </div>
                ) : recommendations.length > 0 ? (
                  <ol style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                    {recommendations.map((rec, i) => (
                      <li key={i} style={{ fontSize: "0.83rem", color: "var(--text-primary)", lineHeight: 1.6, paddingLeft: 4 }}>
                        {rec}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                    No recommendations available.
                  </p>
                )}
              </div>
            )}
          </div>

          <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", textAlign: "center" }}>
            Press <kbd style={{
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              padding: "1px 6px", borderRadius: 4, fontFamily: "monospace", fontSize: "0.75rem"
            }}>Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;