
import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    totalHR: 0,
    totalUsers: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/dashboard");

        setStats(response.data.stats);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Dashboard data load nahi ho saka."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      color: "#2563eb"
    },
    {
      title: "Active Employees",
      value: stats.activeEmployees,
      color: "#16a34a"
    },
    {
      title: "Inactive Employees",
      value: stats.inactiveEmployees,
      color: "#dc2626"
    },
    {
      title: "Total HR",
      value: stats.totalHR,
      color: "#9333ea"
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      color: "#ea580c"
    }
  ];

  if (loading) {
    return <p>Dashboard data load ho raha hai...</p>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <section>
      <h2>Dashboard Overview</h2>
      <p>Apne organization ka current summary dekhein.</p>

      <div style={styles.grid}>
        {cards.map((card) => (
          <div key={card.title} style={styles.card}>
            <p style={styles.title}>{card.title}</p>

            <h2 style={{ ...styles.value, color: card.color }}>
              {card.value}
            </h2>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "18px",
    marginTop: "24px"
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "22px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.04)"
  },
  title: {
    color: "#64748b",
    fontSize: "14px",
    margin: "0 0 12px"
  },
  value: {
    fontSize: "32px",
    margin: 0
  }
};
