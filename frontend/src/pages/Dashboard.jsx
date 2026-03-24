import { useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import FileUpload from "../components/FileUpload";
import CustomerTable from "../components/CustomerTable";
import CustomerModal from "../components/CustomerModal";
import ExportReport from "../components/ExportReport";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const COLORS = ["#ff4d4f", "#faad14", "#52c41a"]; // High, Medium, Low risk

const Dashboard = ({ summary, setSummary, customers, setCustomers }) => {
  const [modalCustomer, setModalCustomer] = useState(null);
  const navigate = useNavigate();

  // Handle data from backend after CSV upload
  const handleData = (data) => {
    setSummary(data.summary);
    setCustomers(data.customers);
  };
  // Pie chart data
  const pieData = summary
    ? [
        { name: "High Risk", value: summary.highRisk },
        { name: "Medium Risk", value: summary.mediumRisk },
        { name: "Low Risk", value: summary.lowRisk },
      ]
    : [];

  // Trend line chart data (simulate monthly churn trends)
  const trendData = summary
    ? [
        {
          month: "Jan",
          churn: summary.highRisk * 0.2 + summary.mediumRisk * 0.1,
        },
        {
          month: "Feb",
          churn: summary.highRisk * 0.25 + summary.mediumRisk * 0.1,
        },
        {
          month: "Mar",
          churn: summary.highRisk * 0.3 + summary.mediumRisk * 0.1,
        },
        {
          month: "Apr",
          churn: summary.highRisk * 0.15 + summary.mediumRisk * 0.05,
        },
        {
          month: "May",
          churn: summary.highRisk * 0.2 + summary.mediumRisk * 0.1,
        },
        {
          month: "Jun",
          churn: summary.highRisk * 0.18 + summary.mediumRisk * 0.08,
        },
      ]
    : [];

  // Bar chart by risk category (simulate)
  const barData = summary
    ? [
        { risk: "High", count: summary.highRisk },
        { risk: "Medium", count: summary.mediumRisk },
        { risk: "Low", count: summary.lowRisk },
      ]
    : [];

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />
      <h1>CRIM Dashboard</h1>

      {/* CSV Upload */}
      <FileUpload onData={handleData} />
      {/* Action Buttons */}
      <div style={{ margin: "20px 0" }}>
        <ExportReport summary={summary} customers={customers} />
        <button
          style={{ padding: "10px 20px", marginLeft: "10px" }}
          onClick={() => navigate("/customers")}
        >
          View Customers
        </button>
      </div>
      {!summary ? (
        <p>Upload a CSV to see the dashboard.</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            <Card title="Total Customers" value={summary.totalCustomers} />
            <Card
              title="Predicted Churners"
              value={summary.predictedChurners}
            />
            <Card
              title="Churn Rate"
              value={`${summary.churnRate.toFixed(2)}%`}
            />
            <Card title="High Risk Customers" value={summary.highRisk} />
            <Card title="Medium Risk Customers" value={summary.mediumRisk} />
            <Card title="Low Risk Customers" value={summary.lowRisk} />
          </div>

          {/* Charts */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "50px",
              marginBottom: "40px",
            }}
          >
            {/* Pie Chart */}
            <div>
              <h3>Churn Risk Distribution</h3>
              <PieChart width={400} height={350}>
                <Pie data={pieData} dataKey="value" label>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>

            {/* Trend Line Chart */}
            <div>
              <h3>Churn Probability Trend (Monthly)</h3>
              <LineChart
                width={500}
                height={350}
                data={trendData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="churn"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </div>

            {/* Bar Chart */}
            <div>
              <h3>Customers by Risk Category</h3>
              <BarChart width={400} height={350} data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="risk" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </div>
          </div>

          {/* Customer Table */}
          <div>
            <h3>Top Customers by Churn Probability</h3>
            <CustomerTable
              customers={customers}
              onRowClick={setModalCustomer}
            />
          </div>

          {/* Customer Details Modal */}
          {modalCustomer && (
            <CustomerModal
              customer={modalCustomer}
              onClose={() => setModalCustomer(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
