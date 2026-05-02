import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Invalid email or password");
        return;
      }

      onLogin(data.access_token);

      setSuccess("Login successful!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d0d14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        color: "#e8e9f0",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#111118",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              fontSize: "12px",
              color: "#9a9dc0",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            CRIM Platform
          </div>

          <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#fff" }}>
            Welcome back
          </h2>

          <p style={{ fontSize: "13px", color: "#6a6d88", marginTop: "8px" }}>
            Login to access your dashboard
          </p>
        </div>
        {error && (
          <div
            style={{
              backgroundColor: "rgba(255,77,79,0.1)",
              border: "1px solid rgba(255,77,79,0.3)",
              color: "#ff4d4f",
              padding: "10px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              backgroundColor: "rgba(34,211,160,0.1)",
              border: "1px solid rgba(34,211,160,0.3)",
              color: "#22d3a0",
              padding: "10px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            {success}
          </div>
        )}      
        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <input
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "#0d0d14",
              color: "#fff",
              outline: "none",
              fontSize: "14px",
            }}
          />

          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "#0d0d14",
              color: "#fff",
              outline: "none",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            marginTop: "22px",
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#1a1a2e" : "#22d3a0",
            color: "#0d0d14",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p
          style={{
            marginTop: "18px",
            fontSize: "12px",
            textAlign: "center",
            color: "#6a6d88",
          }}
        >
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={{ color: "#22d3a0", cursor: "pointer" }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}