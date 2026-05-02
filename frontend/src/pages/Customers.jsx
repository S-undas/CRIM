import { useState } from "react";
import CustomerTable from "../components/CustomerTable";
import CustomerModal from "../components/CustomerModal";
import { getRecommendations } from "../api/recommendations";

const handleClick = async (customerId) => {
  const data = await getRecommendations(uploadId, customerId);
  console.log(data);
};

const loadData = async () => {
  const data = await getRecommendations(uploadId, customerId);
  console.log(data);
};

const Customers = ({ customers, uploadId }) => {
  const [modalCustomer, setModalCustomer] = useState(null);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>All Customers</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {customers.length > 0
              ? `${customers.length.toLocaleString()} customers loaded — click any row to view details`
              : "No data loaded yet — upload a CSV to get started"}
          </p>
        </div>
      </div>

      {customers.length === 0 ? (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "400px", gap: 16,
        }}>
          <div style={{ fontSize: "4rem", opacity: 0.2 }}>◈</div>
          <h2 style={{ color: "var(--text-muted)", fontWeight: 400 }}>No customers yet</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Upload a CSV file from the Uploads page to see customer data here.
          </p>
        </div>
      ) : (
        <CustomerTable
          customers={customers}
          onRowClick={setModalCustomer}
          showAll={true}
        />
      )}

      <CustomerModal
        customer={modalCustomer}
        onClose={() => setModalCustomer(null)}
        uploadId={uploadId}
      />
    </div>
  );
};

export default Customers;