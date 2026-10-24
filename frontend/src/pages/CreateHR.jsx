
import { useState } from "react";
import api from "../services/api";

function CreateHR() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (formData.password.length < 8) {
      setError("Password kam az kam 8 characters ka hona chahiye.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/admin/hr", formData);

      setMessage(
        response.data.message || "HR account successfully create ho gaya."
      );

      setFormData({
        name: "",
        email: "",
        password: ""
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "HR account create nahi ho saka. Backend check karein."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Create HR Account</h1>
        <p style={styles.subtitle}>
          Naya HR user register karein
        </p>

        {message && (
          <div style={styles.success}>{message}</div>
        )}

        {error && (
          <div style={styles.error}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Enter HR full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Email Address</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="hr@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Temporary Password</label>
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Minimum 8 characters"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />

          <p style={styles.hint}>
            HR ko pehli login par password change karna par sakta hai,
            agar aapke login flow mein ye feature implemented hai.
          </p>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Creating HR..." : "Create HR Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f6fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    boxSizing: "border-box"
  },
  card: {
    background: "#ffffff",
    width: "100%",
    maxWidth: "460px",
    padding: "32px",
    borderRadius: "14px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    boxSizing: "border-box"
  },
  heading: {
    margin: "0 0 8px",
    color: "#172554",
    fontSize: "27px"
  },
  subtitle: {
    color: "#64748b",
    marginBottom: "24px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "16px",
    color: "#334155",
    fontWeight: "600"
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box"
  },
  hint: {
    fontSize: "12px",
    lineHeight: "1.5",
    color: "#64748b"
  },
  button: {
    width: "100%",
    padding: "13px",
    marginTop: "14px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer"
  },
  success: {
    padding: "12px",
    marginBottom: "14px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "8px"
  },
  error: {
    padding: "12px",
    marginBottom: "14px",
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "8px"
  }
};

export default CreateHR;
