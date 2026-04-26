import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerProfile from "./pages/CustomerProfile";
import Reports from "./pages/Reports";
import Uploads from "./pages/Uploads";
import "./index.css";

const App = () => {
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
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard summary={summary} customers={customers} uploadId={uploadId} />} />             <Route path="/uploads" element={<Uploads onData={handleData} uploadState={uploadState} onUploadStateChange={setUploadState} />} />
          <Route path="/customers" element={<Customers customers={customers} />} />
          <Route path="/customers/:id" element={<CustomerProfile customers={customers} />} />
          <Route path="/reports" element={<Reports summary={summary} customers={customers} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;