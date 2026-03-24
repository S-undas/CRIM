import React from "react";

const Card = ({ title, value }) => {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f2f5",
        borderRadius: "8px",
        minWidth: "150px",
        textAlign: "center",
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: "1.5rem", margin: 0 }}>{value}</p>
    </div>
  );
};

export default Card;