import Navbar from "../components/Navbar";
import CustomerTable from "../components/CustomerTable";

const Customers = ({ customers }) => {
  return (
    <div style={{ padding: "20px" }}>
      <Navbar />
      <h1>All Customers</h1>
      <p>This page will be implemented in Iteration 2.</p>
    </div>
  );
};

export default Customers;