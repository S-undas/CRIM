import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000/api";

// Normalize feature names
const toLabel = (s) =>
  s
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

// Helper functions
const Pill = ({ label, color = "blue" }) => {
  const colors = {
    blue: {
      bg: "rgba(56,189,248,0.08)",
      border: "rgba(56,189,248,0.22)",
      text: "#7dd3fc",
    },
    green: {
      bg: "rgba(34,197,94,0.08)",
      border: "rgba(34,197,94,0.22)",
      text: "#86efac",
    },
    yellow: {
      bg: "rgba(251,191,36,0.08)",
      border: "rgba(251,191,36,0.22)",
      text: "#fde68a",
    },
    red: {
      bg: "rgba(239,68,68,0.08)",
      border: "rgba(239,68,68,0.2)",
      text: "#fca5a5",
    },
  };
  const c = colors[color] || colors.blue;
  return (
    <span
      style={{
        fontSize: "0.78rem",
        fontFamily: "monospace",
        fontWeight: 500,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 5,
        padding: "4px 10px",
        color: c.text,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
};

const CoverageBar = ({ percent }) => (
  <div
    style={{
      width: "100%",
      height: 5,
      background: "rgba(255,255,255,0.07)",
      borderRadius: 99,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: "100%",
        width: `${percent}%`,
        background: percent >= 60 ? "#22c55e" : "#fbbf24",
        borderRadius: 99,
        transition: "width 0.4s ease",
      }}
    />
  </div>
);

const DropZone = ({ onFileSelect, loading }) => {
  const [dragging, setDragging] = useState(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFileSelect(f);
  };
  const onChange = (e) => {
    const f = e.target.files[0];
    if (f) onFileSelect(f);
  };

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        cursor: loading ? "default" : "pointer",
        border: `2px dashed ${dragging ? "rgba(56,189,248,0.6)" : "rgba(56,189,248,0.2)"}`,
        borderRadius: "var(--radius)",
        padding: "56px 32px",
        background: dragging ? "rgba(56,189,248,0.04)" : "var(--bg-card)",
        transition: "all 0.2s ease",
        position: "relative",
      }}
    >
      {dragging && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.07) 0%, transparent 70%)",
          }}
        />
      )}
      {loading ? (
        <>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "3px solid rgba(56,189,248,0.15)",
              borderTop: "3px solid rgba(56,189,248,0.7)",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            Analysing your file…
          </p>
        </>
      ) : (
        <>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background:
                "linear-gradient(135deg, rgba(56,189,248,0.12), rgba(99,102,241,0.08))",
              border: "1px solid rgba(56,189,248,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            📂
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: "0 0 6px",
              }}
            >
              Drop your CSV here or{" "}
              <span
                style={{
                  color: "rgba(56,189,248,0.9)",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                browse
              </span>
            </p>
            <p
              style={{
                fontSize: "0.83rem",
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              Telecom customer data · CSV format only
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: 420,
            }}
          >
            {["CSV format", "Telecom data", "Any column names"].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: "0.74rem",
                  color: "var(--text-muted)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 20,
                  padding: "3px 10px",
                }}
              >
                ✓ {t}
              </span>
            ))}
          </div>
        </>
      )}
      <input
        type="file"
        accept=".csv"
        onChange={onChange}
        style={{ display: "none" }}
        disabled={loading}
      />
    </label>
  );
};

// Expected features panel
const EXPECTED_FEATURES = [
  "SeniorCitizen",
  "tenure",
  "MonthlyCharges",
  "TotalCharges",
  "gender",
  "Partner",
  "Dependents",
  "PhoneService",
  "MultipleLines",
  "InternetService",
  "OnlineSecurity",
  "OnlineBackup",
  "DeviceProtection",
  "TechSupport",
  "StreamingTV",
  "StreamingMovies",
  "Contract",
  "PaperlessBilling",
  "PaymentMethod",
];

const FeaturesPanel = () => (
  <div
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius)",
      padding: "20px 24px",
      marginTop: 20,
    }}
  >
    <p
      style={{
        margin: "0 0 4px",
        fontSize: "0.85rem",
        fontWeight: 700,
        color: "var(--text-primary)",
      }}
    >
      Expected Model Features
    </p>
    <p
      style={{
        margin: "0 0 14px",
        fontSize: "0.8rem",
        color: "var(--text-muted)",
      }}
    >
      Your CSV columns will be auto-matched to these. Exact names aren't
      required.
    </p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {EXPECTED_FEATURES.map((f) => (
        <Pill key={f} label={toLabel(f)} color="blue" />
      ))}
    </div>
  </div>
);

// Mapping table
const MappingTable = ({
  mapping,
  expectedFeatures,
  onMappingChange,
  summary,
}) => {
  const matched = mapping.filter((m) => m.mappedTo !== null);
  const extra = mapping.filter((m) => m.mappedTo === null);
  const good = summary.coveragePercent >= 60;

  const selectStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid var(--border-subtle)",
    borderRadius: 7,
    padding: "7px 10px",
    fontSize: "0.85rem",
    color: "var(--text-primary)",
    cursor: "pointer",
    width: "100%",
    outline: "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Coverage card */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius)",
          padding: "20px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {good ? "✓" : "⚠"}&nbsp;{summary.coveragePercent}% Feature
              Coverage
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.83rem",
                color: "var(--text-muted)",
              }}
            >
              {summary.matchedCount} of {summary.totalExpected} model features
              matched from your file
              {extra.length > 0 &&
                ` · ${extra.length} column${extra.length > 1 ? "s" : ""} will be ignored`}
            </p>
          </div>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              padding: "5px 13px",
              borderRadius: 20,
              whiteSpace: "nowrap",
              background: good
                ? "rgba(34,197,94,0.12)"
                : "rgba(251,191,36,0.12)",
              border: `1px solid ${good ? "rgba(34,197,94,0.3)" : "rgba(251,191,36,0.3)"}`,
              color: good ? "#86efac" : "#fde68a",
            }}
          >
            {good ? "Ready to predict" : "Low coverage"}
          </span>
        </div>
        <CoverageBar percent={summary.coveragePercent} />
      </div>

      {/* Matched columns table */}
      {matched.length > 0 && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 40px 1fr 100px",
              gap: 12,
              padding: "12px 20px",
              borderBottom: "1px solid var(--border-subtle)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {["Your Column", "", "Maps To", ""].map((h, i) => (
              <p
                key={i}
                style={{
                  margin: 0,
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                }}
              >
                {h}
              </p>
            ))}
          </div>

          {matched.map((row, idx) => (
            <div
              key={row.userColumn}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 40px 1fr 100px",
                gap: 12,
                padding: "11px 20px",
                alignItems: "center",
                borderBottom:
                  idx < matched.length - 1
                    ? "1px solid var(--border-subtle)"
                    : "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.015)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span
                style={{
                  fontSize: "0.87rem",
                  fontFamily: "monospace",
                  color: "var(--text-primary)",
                  background: "rgba(255,255,255,0.04)",
                  padding: "4px 10px",
                  borderRadius: 5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row.userColumn}
              </span>

              <span
                style={{
                  color: "rgba(56,189,248,0.5)",
                  textAlign: "center",
                  fontSize: "1.1rem",
                }}
              >
                →
              </span>

              <select
                value={row.mappedTo || ""}
                onChange={(e) =>
                  onMappingChange(row.userColumn, e.target.value || null)
                }
                style={selectStyle}
              >
                <option value="">— Ignore this column —</option>
                {expectedFeatures.map((f) => (
                  <option key={f} value={f}>
                    {toLabel(f)}
                  </option>
                ))}
              </select>

              <button
                onClick={() => onMappingChange(row.userColumn, null)}
                style={{
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 7,
                  padding: "7px 0",
                  fontSize: "0.82rem",
                  color: "#f87171",
                  cursor: "pointer",
                  fontWeight: 500,
                  width: "100%",
                }}
              >
                Ignore
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Unrecognised columns */}
      {extra.length > 0 && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid var(--border-subtle)",
              background: "rgba(255,255,255,0.02)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "#f87171" }}>✕</span>
            <p
              style={{
                margin: 0,
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
              }}
            >
              Unrecognised Columns — Will Be Ignored
            </p>
          </div>
          <div
            style={{
              padding: "16px 20px",
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {extra.map((row) => (
              <div
                key={row.userColumn}
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                <Pill label={row.userColumn} color="red" />
                <select
                  value=""
                  onChange={(e) =>
                    e.target.value &&
                    onMappingChange(row.userColumn, e.target.value)
                  }
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "0.76rem",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  <option value="">assign…</option>
                  {expectedFeatures.map((f) => (
                    <option key={f} value={f}>
                      {toLabel(f)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <p
            style={{
              margin: 0,
              padding: "0 20px 14px",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              lineHeight: 1.5,
            }}
          >
            These columns had no recognisable match in the model. Use the
            dropdown next to each to manually assign one if needed.
          </p>
        </div>
      )}

      {/* Missing features */}
      {summary.missingFeatures && summary.missingFeatures.length > 0 && (
        <div
          style={{
            background: "rgba(251,191,36,0.03)",
            border: "1px solid rgba(251,191,36,0.18)",
            borderRadius: "var(--radius)",
            padding: "16px 20px",
          }}
        >
          <p
            style={{
              margin: "0 0 6px",
              fontSize: "0.88rem",
              fontWeight: 700,
              color: "#fbbf24",
            }}
          >
            ⚠ Missing Features
          </p>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: "0.81rem",
              color: "var(--text-muted)",
              lineHeight: 1.5,
            }}
          >
            These model features could not be matched from your file and will
            default to zero, which may reduce prediction accuracy:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {summary.missingFeatures.map((f) => (
              <Pill key={f} label={toLabel(f)} color="yellow" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Upload page
const Upload = ({ onData, uploadState, onUploadStateChange }) => {
  const navigate = useNavigate();

  // If parent passes persisted state, use it; otherwise start fresh
  const [step, setStep] = useState(uploadState?.step || "upload");
  const [uploadedFile, setUploadedFile] = useState(
    uploadState?.uploadedFile || null,
  );
  const [previewData, setPreviewData] = useState(
    uploadState?.previewData || null,
  );
  const [mapping, setMapping] = useState(uploadState?.mapping || []);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const persist = (patch) => {
    if (onUploadStateChange) onUploadStateChange(patch);
  };

  const handleFileSelect = async (file) => {
    setError(null);
    setIsLoading(true);
    setUploadedFile(file);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(`${BASE_URL}/upload/preview`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.detail || "Preview failed");
      }
      const data = await res.json();
      setPreviewData(data);
      setMapping(data.suggestedMapping);
      setStep("mapping");
      persist({
        step: "mapping",
        uploadedFile: file,
        previewData: data,
        mapping: data.suggestedMapping,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingChange = (userColumn, newTarget) => {
    const updated = mapping.map((m) =>
      m.userColumn === userColumn ? { ...m, mappedTo: newTarget } : m,
    );
    setMapping(updated);
    persist({ step, uploadedFile, previewData, mapping: updated });
  };

  const liveSummary = (() => {
    if (!previewData) return null;
    const matched = new Set(mapping.map((m) => m.mappedTo).filter(Boolean));
    const total = previewData.expectedFeatures.length;
    return {
      matchedCount: matched.size,
      totalExpected: total,
      coveragePercent: Math.round((matched.size / total) * 1000) / 10,
      extraColumns: mapping.filter((m) => !m.mappedTo).map((m) => m.userColumn),
      missingFeatures: previewData.expectedFeatures.filter(
        (f) => !matched.has(f),
      ),
    };
  })();

  const handleConfirm = async () => {
    if (!uploadedFile) return;
    setIsLoading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", uploadedFile);
    fd.append("mapping", JSON.stringify(mapping));
    try {
      const res = await fetch(`${BASE_URL}/upload/confirm`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.detail || "Prediction failed");
      }
      const data = await res.json();
      onData(data);
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep("upload");
    setPreviewData(null);
    setMapping([]);
    setUploadedFile(null);
    setError(null);
    persist({
      step: "upload",
      uploadedFile: null,
      previewData: null,
      mapping: [],
    });
  };

  return (
    <div
      className="page"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: step === "mapping" ? "flex-start" : "center",
        minHeight: "calc(100vh - 60px)",
        paddingTop: step === "mapping" ? 48 : 0,
        paddingBottom: 48,
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div
        style={{
          width: "100%",
          maxWidth: step === "mapping" ? 860 : 600,
          animation: "fadeUp 0.4s ease",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 60,
              height: 60,
              background:
                "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(99,102,241,0.08))",
              border: "1px solid rgba(56,189,248,0.25)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              margin: "0 auto 18px",
            }}
          >
            ☁
          </div>

          {step === "upload" ? (
            <>
              <h1 style={{ marginBottom: 10, fontSize: "1.7rem" }}>
                Upload Dataset
              </h1>
              <p
                style={{
                  maxWidth: 420,
                  margin: "0 auto",
                  color: "var(--text-muted)",
                  fontSize: "0.92rem",
                  lineHeight: 1.6,
                }}
              >
                Upload a telecom customer CSV to run churn predictions. Columns
                are automatically matched — exact names aren't required.
              </p>
            </>
          ) : (
            <>
              <h1 style={{ marginBottom: 10, fontSize: "1.7rem" }}>
                Review Column Mapping
              </h1>
              <p
                style={{
                  maxWidth: 520,
                  margin: "0 auto",
                  color: "var(--text-muted)",
                  fontSize: "0.92rem",
                  lineHeight: 1.6,
                }}
              >
                We've automatically matched your file's columns to the model's
                expected features. Adjust any mappings below before running
                predictions.
              </p>
              {previewData && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <Pill label={previewData.fileName} color="blue" />
                  <Pill
                    label={`${previewData.rowCount.toLocaleString()} rows`}
                    color="blue"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Upload step */}
        {step === "upload" && (
          <>
            <DropZone onFileSelect={handleFileSelect} loading={isLoading} />
            {error && (
              <div
                style={{
                  marginTop: 14,
                  padding: "13px 18px",
                  borderRadius: "var(--radius)",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  fontSize: "0.85rem",
                  color: "#f87171",
                }}
              >
                {error}
              </div>
            )}
            <FeaturesPanel />
          </>
        )}

        {/* Mapping step */}
        {step === "mapping" && previewData && liveSummary && (
          <>
            <MappingTable
              mapping={mapping}
              expectedFeatures={previewData.expectedFeatures}
              onMappingChange={handleMappingChange}
              summary={liveSummary}
            />

            {error && (
              <div
                style={{
                  marginTop: 14,
                  padding: "13px 18px",
                  borderRadius: "var(--radius)",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  fontSize: "0.85rem",
                  color: "#f87171",
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <button
                onClick={handleBack}
                style={{
                  background: "transparent",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius)",
                  padding: "11px 24px",
                  fontSize: "0.88rem",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                ← Different File
              </button>

              <button
                onClick={handleConfirm}
                disabled={isLoading || liveSummary.matchedCount === 0}
                style={{
                  background:
                    liveSummary.matchedCount === 0 || isLoading
                      ? "rgba(99,102,241,0.25)"
                      : "var(--accent)",
                  border: "none",
                  borderRadius: "var(--radius)",
                  padding: "11px 30px",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color:
                    liveSummary.matchedCount === 0
                      ? "rgba(255,255,255,0.35)"
                      : "#fff",
                  cursor:
                    liveSummary.matchedCount === 0 || isLoading
                      ? "not-allowed"
                      : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {isLoading && (
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.2)",
                      borderTop: "2px solid white",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                )}
                {isLoading ? "Running Predictions…" : "Confirm & Predict →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Upload;