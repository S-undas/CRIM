// ExportReport.jsx
import React from "react";

const ExportReport = ({ summary, customers }) => {
  const handleExport = () => {
    if (!summary || !customers) return;

    const header = ["CustomerID", "Churn Probability", "Risk Level"];
    const rows = customers.map(c => [
      c.customerID,
      (c.churnProbability * 100).toFixed(1),
      c.riskLevel,
    ]);

    const csvContent =
      [header, ...rows].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "churn_report.csv");
    link.click();
  };

  return (
    <button onClick={handleExport} style={{ padding: "10px 20px" }}>
      Export Report
    </button>
  );
};

export default ExportReport;