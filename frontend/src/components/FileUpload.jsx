import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ onData }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle the actual file upload to backend
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onData(res.data);
      setFile(null); // reset after upload
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // Drag & drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: "2px dashed #ccc",
          padding: "30px",
          borderRadius: "8px",
          cursor: "pointer",
          textAlign: "center",
          marginBottom: "10px",
        }}
        onClick={() => document.getElementById("fileInput").click()}
      >
        {file ? file.name : "Drag & drop CSV here or click to select"}
      </div>

      <input
        id="fileInput"
        type="file"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        style={{ padding: "10px 20px" }}
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>
    </div>
  );
};

export default FileUpload;