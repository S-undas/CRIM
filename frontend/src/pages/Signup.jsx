import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/api";

// ---------- SVG Icons ----------
const EmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="gray" strokeWidth="2" />
    <path d="M2 7l8.97 5.7a1.94 1.94 0 002.06 0L22 7" stroke="gray" strokeWidth="2" />
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M7 10V7a5 5 0 0110 0v3" stroke="gray" strokeWidth="2" strokeLinecap="round" />
    <rect x="5" y="10" width="14" height="10" rx="2" stroke="gray" strokeWidth="2" />
  </svg>
);

const EyeOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M2 12S5.5 5 12 5s10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="gray" strokeWidth="2" />
    <circle cx="12" cy="12" r="2" stroke="gray" strokeWidth="2" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 3L21 21" stroke="gray" strokeWidth="2" strokeLinecap="round" />
    <path d="M10.6 10.6A2 2 0 0013.4 13.4" stroke="gray" strokeWidth="2" strokeLinecap="round" />
    <path d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 2 12 2 12a18 18 0 014.06-5.94" stroke="gray" strokeWidth="2" strokeLinecap="round" />
    <path d="M9.53 4.53A9 9 0 0112 4c7 0 10 8 10 8a18 18 0 01-2.16 3.19" stroke="gray" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const InboxIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 16px", display: "block" }}>
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#a3e635" strokeWidth="1.5" />
    <path d="M2 7l8.97 5.7a1.94 1.94 0 002.06 0L22 7" stroke="#a3e635" strokeWidth="1.5" />
    <circle cx="18" cy="18" r="5" fill="#a3e635" />
    <path d="M15.5 18l1.5 1.5 2.5-2.5" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  // After successful signup, switch to "check inbox" view
  const [signedUp, setSignedUp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const navigate = useNavigate();

  const handleEmailBlur = () => {
    if (email && !emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (emailError) setEmailError("");
  };

  const checkPasswordStrength = (value) => {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (score <= 1) setPasswordStrength("Weak");
    else if (score === 2 || score === 3) setPasswordStrength("Medium");
    else setPasswordStrength("Strong");

    if (value.length > 72) {
      setPasswordError("Password too long (max 72)");
    } else {
      setPasswordError("");
    }
  };

  const isFormValid =
    email &&
    password &&
    !emailError &&
    !passwordError &&
    password.length >= 6 &&
    emailRegex.test(email);

  const handleSignup = async () => {
    setError("");

    if (!isFormValid) {
      if (!emailRegex.test(email)) setEmailError("Enter a valid email address");
      setError("Please fix validation errors first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.detail === "User already exists") {
          setError("Account already exists. Redirecting to login...");
          setTimeout(() => navigate("/login"), 1200);
        } else {
          setError(data.detail || "Signup failed");
        }
        return;
      }

      // Success → switch to "check your inbox" screen
      // Success → go straight to login
navigate("/login");
    } catch {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const strengthColor =
    passwordStrength === "Strong"
      ? "#a3e635"
      : passwordStrength === "Medium"
        ? "#facc15"
        : "#ff4d4f";

  // ── Check-your-inbox screen ──────────────────────────────────────────────
  if (signedUp) {
    return (
      <div style={styles.page}>
        <div style={styles.glowBottomRight} />
        <div style={styles.glowBottomLeft} />

        <nav style={styles.nav}>
          <span onClick={() => navigate("/")} style={styles.logo}>CRIM</span>
        </nav>

        <div style={styles.card}>
          <InboxIcon />
          <h2 style={{ ...styles.title, fontSize: "22px", marginBottom: "10px" }}>
            Check your inbox
          </h2>
          <p style={{ ...styles.subtitle, lineHeight: "1.7", marginBottom: "20px" }}>
            We sent a confirmation link to<br />
            <strong style={{ color: "#a3e635" }}>{registeredEmail}</strong>
          </p>
          <p style={{ ...styles.subtitle, lineHeight: "1.6" }}>
            Click the link in that email to activate your account.
            The link expires in <strong style={{ color: "#e8e9f0" }}>24 hours</strong>.
          </p>

          <div style={styles.divider} />

          <p style={{ ...styles.subtitle, fontSize: "12px", marginBottom: "16px" }}>
            Didn't receive it? Check your spam folder, or—
          </p>
          <button
            style={{ ...styles.submitBtn, background: "transparent", border: "1px solid rgba(163,230,53,0.4)", color: "#a3e635", marginBottom: "12px" }}
            onClick={() => { setSignedUp(false); setEmail(registeredEmail); }}
          >
            Re-enter email & resend
          </button>
          <button
            style={{ ...styles.submitBtn }}
            onClick={() => navigate("/login")}
          >
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  // ── Main signup form ─────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.glowBottomRight} />
      <div style={styles.glowBottomLeft} />

      <nav style={styles.nav}>
        <span onClick={() => navigate("/")} style={styles.logo}>CRIM</span>
      </nav>

      <form
        style={styles.card}
        onSubmit={(e) => { e.preventDefault(); handleSignup(); }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Start predicting churn in minutes</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Email */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>EMAIL ADDRESS</label>
          <div
            style={{
              ...styles.inputWrapper,
              border: emailError
                ? "1px solid rgba(255,77,79,0.5)"
                : email && !emailError && emailRegex.test(email)
                  ? "1px solid rgba(163,230,53,0.35)"
                  : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <EmailIcon />
            <input
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              style={styles.input}
            />
          </div>
          {emailError && <div style={styles.smallError}>{emailError}</div>}
        </div>

        {/* Password */}
        <div style={{ ...styles.fieldGroup, marginTop: "16px" }}>
          <label style={styles.label}>PASSWORD</label>
          <div
            style={{
              ...styles.inputWrapper,
              border:
                passwordStrength === "Strong"
                  ? "1px solid rgba(163,230,53,0.35)"
                  : passwordStrength === "Medium"
                    ? "1px solid rgba(250,204,21,0.35)"
                    : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <LockIcon />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
              style={styles.input}
            />
            <span style={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </span>
          </div>

          {password && (
            <div style={styles.strengthRow}>
              <span style={styles.strengthLabel}>Strength: </span>
              <span style={{ color: strengthColor, fontWeight: "600", fontSize: "11px" }}>
                {passwordStrength}
              </span>
              <div style={styles.strengthBarTrack}>
                <div
                  style={{
                    ...styles.strengthBarFill,
                    width: passwordStrength === "Strong" ? "100%" : passwordStrength === "Medium" ? "60%" : "25%",
                    backgroundColor: strengthColor,
                  }}
                />
              </div>
            </div>
          )}

          {passwordError && <div style={styles.smallError}>{passwordError}</div>}
        </div>

        <button
          type="submit"
          disabled={!isFormValid || loading}
          style={{
            ...styles.submitBtn,
            marginTop: "22px",
            opacity: !isFormValid || loading ? 0.45 : 1,
            cursor: !isFormValid || loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating account..." : "Sign up →"}
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={styles.link}>Login</span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#050505",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#e8e9f0",
    position: "relative",
    overflow: "hidden",
    paddingTop: "0px",
  },
  glowBottomRight: {
    position: "fixed",
    bottom: "-100px",
    right: "-100px",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(163,230,53,0.18) 0%, rgba(163,230,53,0.04) 50%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  glowBottomLeft: {
    position: "fixed",
    bottom: "0px",
    left: "150px",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(163,230,53,0.10) 0%, transparent 65%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  nav: { position: "fixed", top: 0, left: 0, right: 0, padding: "14px 32px", zIndex: 100 },
  logo: { fontWeight: "800", fontSize: "18px", letterSpacing: "2px", color: "#a3e635", cursor: "pointer" },
  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "380px",
    backgroundColor: "#111318",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "36px 32px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
    marginTop: "-30px",
    textAlign: "center",
  },
  title: { fontSize: "26px", fontWeight: "700", color: "#ffffff", margin: "0 0 6px" },
  subtitle: { fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 },
  divider: { height: "1px", background: "rgba(255,255,255,0.06)", margin: "20px 0" },
  errorBox: {
    background: "rgba(255,77,79,0.1)",
    border: "1px solid rgba(255,77,79,0.3)",
    color: "#ff4d4f",
    padding: "10px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "14px",
    textAlign: "center",
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "7px", textAlign: "left" },
  label: { fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", letterSpacing: "1px" },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#0c0e13",
    borderRadius: "8px",
    padding: "0 14px",
    gap: "10px",
  },
  eyeBtn: { cursor: "pointer", display: "flex", alignItems: "center" },
  input: { flex: 1, padding: "12px 0", backgroundColor: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "14px" },
  strengthRow: { display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" },
  strengthLabel: { fontSize: "11px", color: "rgba(255,255,255,0.35)" },
  strengthBarTrack: { flex: 1, height: "3px", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" },
  strengthBarFill: { height: "100%", borderRadius: "2px", transition: "width 0.3s ease, background-color 0.3s ease" },
  smallError: { color: "#ff4d4f", fontSize: "11px", marginTop: "2px" },
  submitBtn: {
    width: "100%",
    padding: "13px",
    backgroundColor: "#a3e635",
    color: "#0a0a0a",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.3px",
    cursor: "pointer",
  },
  footer: { marginTop: "20px", fontSize: "13px", textAlign: "center", color: "rgba(255,255,255,0.3)" },
  link: { color: "#a3e635", cursor: "pointer", fontWeight: "600" },
};