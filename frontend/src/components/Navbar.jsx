import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) => ({
    padding: "6px 14px",
    borderRadius: "20px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    color: isActive ? "#fff" : "#aaa",
    backgroundColor: isActive ? "rgba(255,255,255,0.08)" : "transparent",
    transition: "all 0.2s",
  });

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 40px",
        backgroundColor: "#111118",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <span
        onClick={() => navigate("/")}
        style={{
          fontStyle: "italic",
          fontWeight: "600",
          fontSize: "16px",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        CRIM
      </span>

      {/* Center Links */}
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        <NavLink to="/" end style={linkStyle}>Home</NavLink>
        <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/uploads" style={linkStyle}>Uploads</NavLink>
        <NavLink to="/customers" style={linkStyle}>Customers</NavLink>
        <NavLink to="/reports" style={linkStyle}>Reports</NavLink>
      </div>

      {/* RIGHT SIDE (THIS IS THE IMPORTANT PART) */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

        {isLoggedIn ? (
          // 🔴 LOGOUT BUTTON
          <button
            onClick={onLogout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ff4d4f",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        ) : (
          // 🟢 LOGIN + SIGNUP
          <>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                color: "#ccc",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              style={{
                padding: "8px 16px",
                backgroundColor: "#22d3a0",
                color: "#0d0d14",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Sign up
            </button>
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;