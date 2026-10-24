
import { useState } from "react";
import api from "../services/api";

export default function ChangePassword({ onComplete, onLogout }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (newPassword.length < 8) {
      setMessage("New password kam az kam 8 characters ka hona chahiye.");
      return;
    }

    try {
      setLoading(true);

      await api.patch("/auth/change-password", {
        currentPassword,
        newPassword
      });

      onComplete();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Password change nahi ho saka."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1>Change Your Password</h1>
        <p>Dashboard access karne se pehle naya password set karein.</p>

        <form onSubmit={handleSubmit}>
          <label>Current Password</label>
          <input
            style={styles.input}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <label>New Password</label>
          <input
            style={styles.input}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />

          {message && <p style={styles.error}>{message}</p>}

          <button style={styles.button} disabled={loading}>
            {loading ? "Saving..." : "Change Password"}
          </button>

          <button
            type="button"
            style={styles.logout}
            onClick={onLogout}
          >
            Logout
          </button>
        </form>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "20px",
    background: "#eef4f1",
    fontFamily: "Arial, sans-serif"
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    boxSizing: "border-box",
    padding: "30px",
    borderRadius: "14px",
    background: "#fff"
  },
  input: {
    display: "block",
    boxSizing: "border-box",
    width: "100%",
    padding: "12px",
    margin: "8px 0 18px",
    border: "1px solid #ccc",
    borderRadius: "6px"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#176b45",
    color: "#fff",
    border: 0,
    borderRadius: "6px",
    cursor: "pointer"
  },
  logout: {
    marginTop: "12px",
    padding: "10px",
    cursor: "pointer"
  },
  error: { color: "#b42318" }
};
