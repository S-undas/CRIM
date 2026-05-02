import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerProfile from "./pages/CustomerProfile";
import Reports from "./pages/Reports";
import Uploads from "./pages/Uploads";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import "./index.css";

const App = () => {
  // -------------------------
  // AUTH STATE (FIXED)
  // -------------------------
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const isLoggedIn = Boolean(token);

  // Load token on first render
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // -------------------------
  // APP DATA STATE
  // -------------------------
  const [summary, setSummary] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [uploadId, setUploadId] = useState(null);
  const [uploadState, setUploadState] = useState(null);

  const handleData = (data) => {
    setSummary(data.summary);
    setCustomers(data.customers);
    setUploadId(data.uploadId);
  };

  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Navbar */}
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        <Routes>

          {/* ---------------- HOME ---------------- */}
          <Route path="/" element={<Home />} />

          {/* ---------------- AUTH PAGES ---------------- */}
          <Route
            path="/login"
            element={
              !isLoggedIn ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          <Route
            path="/signup"
            element={
              !isLoggedIn ? (
                <Signup />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          {/* ---------------- PROTECTED ROUTES ---------------- */}

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard summary={summary} customers={customers} uploadId={uploadId} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/uploads"
            element={
              isLoggedIn ? (
                <Uploads
                  onData={handleData}
                  uploadState={uploadState}
                  onUploadStateChange={setUploadState}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/customers"
            element={
              isLoggedIn ? (
                <Customers customers={customers} uploadId={uploadId} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/customers/:id"
            element={
              isLoggedIn ? (
                <CustomerProfile customers={customers} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/reports"
            element={
              isLoggedIn ? (
                <Reports summary={summary} customers={customers} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

        </Routes>
      </div>
    </Router>
  );
};

export default App;