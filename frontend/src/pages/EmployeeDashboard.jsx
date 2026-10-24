
import { useEffect, useState } from "react";
import api from "../services/api";

export default function EmployeeDashboard({ user, onLogout }) {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api.get("/employee/dashboard")
      .then((response) => {
        if (mounted) setEmployee(response.data.employee);
      })
      .catch((err) => {
        if (mounted) {
          setError(
            err.response?.data?.message ||
            "Employee profile load nahi hui."
          );
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1>HCM Lite</h1>
          <p>Employee Self-Service Portal</p>
        </div>
        <button style={styles.button} onClick={onLogout}>
          Logout
        </button>
      </header>

      <section style={styles.card}>
        <h2>Welcome, {user.name}</h2>
        <p>Yahan aap apni employee information dekh sakte hain.</p>

        {loading && <p>Profile load ho rahi hai...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {employee && (
          <div style={styles.grid}>
            {[
              ["Employee Code", employee.employeeCode],
              ["Full Name", employee.name],
              ["Email", employee.email],
              ["Phone", employee.phone || "Not provided"],
              ["Department", employee.department],
              ["Designation", employee.designation],
              [
                "Joining Date",
                employee.joiningDate
                  ? new Date(employee.joiningDate).toLocaleDateString()
                  : "Not provided"
              ],
              ["Status", employee.isActive === false ? "Inactive" : "Active"]
            ].map(([label, value]) => (
              <div key={label} style={styles.item}>
                <small>{label}</small>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    background: "#f1f5f9",
    fontFamily: "Arial, sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap"
  },
  card: {
    marginTop: "24px",
    padding: "24px",
    background: "#fff",
    borderRadius: "12px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginTop: "24px"
  },
  item: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "16px",
    background: "#f8fafc",
    borderRadius: "8px",
    overflowWrap: "anywhere"
  },
  button: {
    padding: "10px 16px",
    background: "#176b45",
    color: "#fff",
    border: 0,
    borderRadius: "6px",
    cursor: "pointer"
  },
  error: { color: "#b42318" }
};
