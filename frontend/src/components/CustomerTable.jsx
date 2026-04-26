import { useState } from "react";

const getRiskClass = (level) => {
  if (level === "High")   return "badge badge-high";
  if (level === "Medium") return "badge badge-medium";
  return "badge badge-low";
};

const PAGE_SIZE = 50;

const CustomerTable = ({ customers, onRowClick, showAll = false }) => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = customers
    .filter((c) => filter === "All" || c.riskLevel === filter)
    .filter((c) => !search || c.customerID.toString().includes(search))
    .sort((a, b) => b.churnProbability - a.churnProbability);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (lvl) => {
    setFilter(lvl);
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      {/* Controls */}
      <div style={{
        display: "flex", gap: "12px", marginBottom: "16px",
        flexWrap: "wrap", alignItems: "center",
      }}>
        <input
          type="text"
          placeholder="Search customer ID…"
          value={search}
          onChange={handleSearch}
          style={{ minWidth: 200 }}
        />
        <div style={{ display: "flex", gap: "6px" }}>
          {["All", "High", "Medium", "Low"].map((lvl) => (
            <button
              key={lvl}
              className="btn btn-secondary"
              onClick={() => handleFilterChange(lvl)}
              style={{
                padding: "6px 14px", fontSize: "0.8rem",
                background: filter === lvl ? "var(--accent-glow)" : "var(--bg-elevated)",
                borderColor: filter === lvl ? "rgba(56,189,248,0.4)" : "var(--border)",
                color: filter === lvl ? "var(--accent)" : "var(--text-muted)",
              }}
            >{lvl}</button>
          ))}
        </div>
        <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--text-dim)" }}>
          Showing {paginated.length} of {filtered.length} customers
        </span>
      </div>

      {/* Table */}
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}>
        <table>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Churn Probability</th>
              <th>Risk Level</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c, i) => (
              <tr key={c.customerID} onClick={() => onRowClick(c)}
                style={{ animationDelay: `${i * 20}ms`, cursor: "pointer" }}>
                <td className="mono" style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                  #{c.customerID}
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: 80, height: 6,
                      background: "var(--bg-elevated)",
                      borderRadius: 3, overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${c.churnProbability * 100}%`,
                        height: "100%",
                        background: c.riskLevel === "High" ? "var(--high)"
                          : c.riskLevel === "Medium" ? "var(--medium)" : "var(--low)",
                        borderRadius: 3,
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                    <span className="mono" style={{ fontSize: "0.82rem" }}>
                      {(c.churnProbability * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td>
                  <span className={getRiskClass(c.riskLevel)}>{c.riskLevel}</span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--accent)", opacity: 0.7 }}>
                    View →
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--text-dim)" }}>
            No customers match the current filter.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: 8, marginTop: 16,
        }}>
          <button
            className="btn btn-secondary"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ padding: "6px 14px", fontSize: "0.8rem", opacity: page === 1 ? 0.4 : 1 }}
          >← Prev</button>

          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Page {page} of {totalPages}
          </span>

          <button
            className="btn btn-secondary"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ padding: "6px 14px", fontSize: "0.8rem", opacity: page === totalPages ? 0.4 : 1 }}
          >Next →</button>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;