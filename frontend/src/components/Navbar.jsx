import React from "react";
import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
 // npm install lucide-react for icons
const Navbar = () => {
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
      <span style={{ fontStyle: "italic", fontWeight: "600", fontSize: "16px", color: "#fff"}}>
        CRIM
      </span>
      
 
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        <NavLink to="/" end style={linkStyle}>Home</NavLink>
        <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/uploads" style={linkStyle}>Uploads</NavLink>
        <NavLink to="/customers" style={linkStyle}>Customers</NavLink>
        <NavLink to="/reports" style={linkStyle}>Reports</NavLink>
      </div>
 
      <div
        style={{
          width: "34px", height: "34px", borderRadius: "50%",
          backgroundColor: "#2a2a3a", display: "flex",
          alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}
      >
      <User size={18} color="#aaa" />
      </div>
    </nav>
  );
};

export default Navbar;