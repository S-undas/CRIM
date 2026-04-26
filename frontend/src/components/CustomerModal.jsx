import { useEffect } from "react";

const getRiskStyle = (level) => {
  if (level === "High")   return { color: "var(--high)",   bg: "var(--high-bg)" };
  if (level === "Medium") return { color: "var(--medium)", bg: "var(--medium-bg)" };
  return { color: "var(--low)", bg: "var(--low-bg)" };
};

const formatFeatureName = (name) =>
  name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const ShapBar = ({ feature, shapValue, value }) => {
  const isPositive = shapValue > 0;
  const maxBar = 120;
  const barWidth = Math.min(Math.abs(shapValue) * 400, maxBar);
  const color = isPositive ? "#f87171" : "#34d399";
  const label = isPositive ? "↑ increases risk" : "↓ decreases risk";

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
        {/* Negative side */}
        <div style={{ width: maxBar, display: "flex", justifyContent: "flex-end" }}>
          {!isPositive && (
            <div style={{
              height: 8, width: barWidth,
              background: color,
              borderRadius: "4px 0 0 4px",
              opacity: 0.85,
              transition: "width 0.5s ease",
            }} />
          )}
        </div>

        {/* Center line */}
        <div style={{ width: 1, height: 16, background: "var(--border)", flexShrink: 0 }} />

        {/* Positive side */}
        <div style={{ width: maxBar }}>
          {isPositive && (
            <div style={{
              height: 8, width: barWidth,
              background: color,
              borderRadius: "0 4px 4px 0",
              opacity: 0.85,
              transition: "width 0.5s ease",
            }} />
          )}
        </div>

        <span style={{ fontSize: "0.72rem", color, whiteSpace: "nowrap", minWidth: 110 }}>
          {label}
        </span>
      </div>
    </div>
  );
};

const CustomerModal = ({ customer, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

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
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "32px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
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

        {/* Churn Meter */}
        <div style={{
          background: "var(--bg-elevated)",
          borderRadius: "var(--radius)",
          padding: "20px",
          marginBottom: "20px",
          border: "1px solid var(--border-subtle)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Churn Probability</span>
            <span className="mono" style={{ fontSize: "1.2rem", fontWeight: 700, color: risk.color }}>
              {pct}%
            </span>
          </div>
          <div style={{ height: 10, background: "var(--border)", borderRadius: 5, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${risk.color}88, ${risk.color})`,
              borderRadius: 5,
              transition: "width 0.6s ease",
            }} />
          </div>
        </div>

        {/* Risk Badge */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px",
          background: risk.bg,
          border: `1px solid ${risk.color}33`,
          borderRadius: "var(--radius)",
          marginBottom: "24px",
        }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Risk Level</span>
          <span style={{
            fontWeight: 700, fontSize: "0.875rem",
            color: risk.color, textTransform: "uppercase", letterSpacing: "0.05em"
          }}>{customer.riskLevel}</span>
        </div>

        {/* SHAP Explanation */}
        {shap.length > 0 && (
          <div style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius)",
            padding: "20px",
            marginBottom: "20px",
          }}>
            <p style={{ margin: "0 0 4px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Why this prediction?
            </p>
            <p style={{ margin: "0 0 18px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Top factors influencing this customer's churn risk
            </p>

            {/* Legend */}
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
              <ShapBar
                key={i}
                feature={s.feature}
                shapValue={s.shapValue}
                value={s.value}
              />
            ))}
          </div>
        )}

        <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", textAlign: "center" }}>
          Press <kbd style={{
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            padding: "1px 6px", borderRadius: 4, fontFamily: "monospace", fontSize: "0.75rem"
          }}>Esc</kbd> to close
        </p>
      </div>
    </div>
  );
};

export default CustomerModal;