import React, { useState } from "react";

const CustomerTable = ({ customers, onRowClick }) => {
  const [filter, setFilter] = useState("All");

  const filteredCustomers = customers.filter((c) =>
    filter === "All" ? true : c.riskLevel === filter
  );

  return (
    <div>
      {/* Filter dropdown */}
      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "10px" }}>Filter by Risk Level:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th>Customer ID</th>
            <th>Churn Probability</th>
            <th>Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers
            .sort((a, b) => b.churnProbability - a.churnProbability)
            .slice(0, 20)
            .map((c) => (
              <tr
                key={c.customerID}
                style={{ cursor: "pointer" }}
                onClick={() => onRowClick(c)}
              >
                <td>{c.customerID}</td>
                <td>{(c.churnProbability * 100).toFixed(1)}%</td>
                <td>{c.riskLevel}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;