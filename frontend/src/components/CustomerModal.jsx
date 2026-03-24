import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // required for accessibility

const CustomerModal = ({ customer, onClose }) => {
  return (
    <Modal
      isOpen={!!customer}
      onRequestClose={onClose}
      contentLabel="Customer Details"
      style={{
        content: { top: "50%", left: "50%", right: "auto", bottom: "auto", transform: "translate(-50%, -50%)" },
      }}
    >
      <h2>Customer Details</h2>
      <p><strong>ID:</strong> {customer.customerID}</p>
      <p><strong>Churn Probability:</strong> {(customer.churnProbability * 100).toFixed(1)}%</p>
      <p><strong>Risk Level:</strong> {customer.riskLevel}</p>
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default CustomerModal;