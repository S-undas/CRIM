import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showContinue, setShowContinue] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const navigate = useNavigate();

  // ---------------- EMAIL VALIDATION ----------------
  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(value)) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // ---------------- PASSWORD STRENGTH ----------------
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

  // ---------------- FORM VALIDITY ----------------
  const isFormValid =
    email &&
    password &&
    !emailError &&
    !passwordError &&
    password.length >= 6;

  // ---------------- SIGNUP ----------------
  const handleSignup = async () => {
    setError("");
    setSuccess("");

    if (!isFormValid) {
      setError("Please fix validation errors first");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/signup", {
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

      setSuccess("Account created successfully!");
      setShowContinue(true);
    } catch {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={styles.tag}>CRIM Platform</div>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>Start predicting churn in minutes</p>
        </div>

        {/* ERROR / SUCCESS */}
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        {/* CONTINUE BUTTON */}
        {showContinue && (
          <button style={styles.ctaBtn} onClick={() => navigate("/login")}>
            Continue to Login →
          </button>
        )}

        {/* EMAIL */}
        <input
          placeholder="Email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          style={{
            ...styles.input,
            border: emailError
              ? "1px solid #ff4d4f"
              : email
              ? "1px solid #22d3a0"
              : styles.input.border,
          }}
        />

        {emailError && <div style={styles.smallError}>{emailError}</div>}

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            checkPasswordStrength(e.target.value);
          }}
          style={{
            ...styles.input,
            border:
              passwordStrength === "Strong"
                ? "1px solid #22d3a0"
                : passwordStrength === "Medium"
                ? "1px solid #facc15"
                : styles.input.border,
          }}
        />

        {/* PASSWORD STRENGTH */}
        {password && (
          <div style={styles.strength}>
            Strength:{" "}
            <span
              style={{
                color:
                  passwordStrength === "Strong"
                    ? "#22d3a0"
                    : passwordStrength === "Medium"
                    ? "#facc15"
                    : "#ff4d4f",
              }}
            >
              {passwordStrength}
            </span>
          </div>
        )}

        {/* SIGNUP BUTTON */}
        <button
          onClick={handleSignup}
          disabled={!isFormValid || loading}
          style={{
            ...styles.btn,
            opacity: !isFormValid || loading ? 0.5 : 1,
            cursor: !isFormValid || loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        {/* FOOTER */}
        <p style={styles.footer}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={styles.link}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0d0d14",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
  },
  card: {
    width: "420px",
    backgroundColor: "#111118",
    padding: "40px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  tag: {
    fontSize: "12px",
    color: "#9a9dc0",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },
  title: { color: "#fff", fontSize: "26px", fontWeight: "700" },
  subtitle: { color: "#6a6d88", fontSize: "13px" },

  input: {
    width: "100%",
    padding: "12px",
    marginTop: "14px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "#0d0d14",
    color: "#fff",
    outline: "none",
  },

  btn: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    backgroundColor: "#22d3a0",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
  },

  ctaBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#22d3a0",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  errorBox: {
    background: "rgba(255,77,79,0.1)",
    border: "1px solid rgba(255,77,79,0.3)",
    color: "#ff4d4f",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },

  successBox: {
    background: "rgba(34,211,160,0.1)",
    border: "1px solid rgba(34,211,160,0.3)",
    color: "#22d3a0",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },

  smallError: {
    color: "#ff4d4f",
    fontSize: "12px",
    marginTop: "5px",
  },

  strength: {
    fontSize: "12px",
    marginTop: "6px",
    color: "#aaa",
  },

  footer: {
    marginTop: "18px",
    fontSize: "12px",
    textAlign: "center",
    color: "#6a6d88",
  },

  link: {
    color: "#22d3a0",
    cursor: "pointer",
  },
};