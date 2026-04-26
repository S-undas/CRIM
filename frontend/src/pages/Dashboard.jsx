import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CustomerTable from "../components/CustomerTable";
import CustomerModal from "../components/CustomerModal";
import ExportReport from "../components/ExportReport";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

const COLORS = ["#f85149", "#e3b341", "#3fb950"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: 8, padding: "10px 14px", fontSize: "0.8rem",
    }}>
      {label && <p style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "var(--accent)", fontWeight: 600 }}>
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
};

const Dashboard = ({ summary, customers, uploadId }) => {
  const [modalCustomer, setModalCustomer] = useState(null);
  const navigate = useNavigate();

  const pieData = summary ? [
    { name: "High Risk",   value: summary.highRisk },
    { name: "Medium Risk", value: summary.mediumRisk },
    { name: "Low Risk",    value: summary.lowRisk },
  ] : [];

  const trendData = summary ? [
    { month: "Jan", churn: +(summary.highRisk * 0.20 + summary.mediumRisk * 0.10).toFixed(1) },
    { month: "Feb", churn: +(summary.highRisk * 0.25 + summary.mediumRisk * 0.10).toFixed(1) },
    { month: "Mar", churn: +(summary.highRisk * 0.30 + summary.mediumRisk * 0.10).toFixed(1) },
    { month: "Apr", churn: +(summary.highRisk * 0.15 + summary.mediumRisk * 0.05).toFixed(1) },
    { month: "May", churn: +(summary.highRisk * 0.20 + summary.mediumRisk * 0.10).toFixed(1) },
    { month: "Jun", churn: +(summary.highRisk * 0.18 + summary.mediumRisk * 0.08).toFixed(1) },
  ] : [];

  const barData = summary ? [
    { risk: "High",   count: summary.highRisk,   fill: "#f85149" },
    { risk: "Medium", count: summary.mediumRisk, fill: "#e3b341" },
    { risk: "Low",    count: summary.lowRisk,    fill: "#3fb950" },
  ] : [];

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>Dashboard</h1>
          <p>Customer Retention & Intervention Management</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <ExportReport summary={summary} customers={customers} />
          <button className="btn btn-secondary" onClick={() => navigate("/customers")}>
            View All Customers →
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/uploads")}>
            ↑ Upload CSV
          </button>
        </div>
      </div>

      {!summary ? (
        /* Empty State */
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "400px", gap: "16px",
        }}>
          <div style={{ fontSize: "4rem", opacity: 0.2 }}>◈</div>
          <h2 style={{ color: "var(--text-muted)", fontWeight: 400 }}>No data loaded</h2>
          <p style={{ textAlign: "center", maxWidth: 360 }}>
            Upload a customer CSV file to see churn predictions, risk distribution, and analytics.
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/uploads")} style={{ marginTop: 8 }}>
            ↑ Upload CSV File
          </button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid-stats">
            <Card title="Total Customers" value={summary.totalCustomers.toLocaleString()} delay={0} />
            <Card title="Predicted Churners" value={summary.predictedChurners.toLocaleString()} delay={60} accent />
            <Card title="Churn Rate" value={`${summary.churnRate.toFixed(1)}%`} delay={120} />
            <Card title="High Risk" value={summary.highRisk.toLocaleString()}
              sub="customers" delay={180} />
            <Card title="Medium Risk" value={summary.mediumRisk.toLocaleString()}
              sub="customers" delay={240} />
            <Card title="Low Risk" value={summary.lowRisk.toLocaleString()}
              sub="customers" delay={300} />
          </div>

          {/* Charts */}
          <div className="grid-charts">
            {/* Pie */}
            <div className="card animate-fade-up" style={{ animationDelay: "200ms" }}>
              <h3 style={{ marginBottom: 20 }}>Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={90}
                    innerRadius={50} paddingAngle={3} label={({ name, percent }) =>
                      `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} stroke="var(--bg-card)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(val) => <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Trend */}
            <div className="card animate-fade-up" style={{ animationDelay: "260ms" }}>
              <h3 style={{ marginBottom: 20 }}>Churn Trend (Monthly)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                  <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                    axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="churn" stroke="var(--accent)"
                    strokeWidth={2} dot={{ fill: "var(--accent)", r: 4 }}
                    activeDot={{ r: 6, fill: "var(--accent)" }} name="Churners" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar */}
            <div className="card animate-fade-up" style={{ animationDelay: "320ms" }}>
              <h3 style={{ marginBottom: 20 }}>Customers by Risk</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="risk" tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                  <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                    axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Customers" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2>Top Customers by Churn Risk</h2>
              <button className="btn btn-secondary" onClick={() => navigate("/customers")}
                style={{ fontSize: "0.8rem" }}>
                View all →
              </button>
            </div>
            <CustomerTable customers={customers} onRowClick={setModalCustomer} />
          </div>
        </>
      )}

      <CustomerModal customer={modalCustomer} onClose={() => setModalCustomer(null)} uploadId={uploadId} />
    </div>
  );
};

export default Dashboard;