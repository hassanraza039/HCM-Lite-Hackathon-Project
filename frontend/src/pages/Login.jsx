
import { useState } from "react";
import api from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password
      });

      const { token, user } = response.data;

      localStorage.setItem("hcm_token", token);
      localStorage.setItem("hcm_user", JSON.stringify(user));

      onLogin({ token, user });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Backend server check karein."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.logo}>HCM</div>

        <h1>Welcome to HCM Lite</h1>
        <p style={styles.subtitle}>
          Human Capital Management System
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            style={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            style={styles.input}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && (
            <p role="alert" style={styles.error}>
              {error}
            </p>
          )}

          <button
            style={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Secure employee management portal
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    background: "#eef4f1",
    fontFamily: "Arial, sans-serif"
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    boxSizing: "border-box",
    padding: "34px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.09)"
  },
  logo: {
    width: "58px",
    height: "58px",
    display: "grid",
    placeItems: "center",
    borderRadius: "12px",
    background: "#176b45",
    color: "#ffffff",
    fontSize: "19px",
    fontWeight: "bold"
  },
  subtitle: {
    color: "#64748b",
    marginBottom: "28px"
  },
  input: {
    display: "block",
    boxSizing: "border-box",
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "20px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px"
  },
  button: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "7px",
    background: "#176b45",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  error: {
    color: "#b42318",
    fontSize: "14px"
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "12px"
  }
};
