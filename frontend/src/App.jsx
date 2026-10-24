
import { useState } from "react";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeManagement from "./pages/EmployeeManagement";
import CreateHR from "./pages/CreateHR";
import AdminDashboard from "./pages/AdminDashboard";
export default function App() {
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem("hcm_token");
    const savedUser = localStorage.getItem("hcm_user");

    if (!token || !savedUser) return null;

    try {
      return {
        token,
        user: JSON.parse(savedUser)
      };
    } catch {
      localStorage.removeItem("hcm_token");
      localStorage.removeItem("hcm_user");
      return null;
    }
  });

  const [adminPage, setAdminPage] = useState("dashboard");

  const logout = () => {
    localStorage.removeItem("hcm_token");
    localStorage.removeItem("hcm_user");
    setSession(null);
  };

  const completePasswordChange = () => {
    const updatedUser = {
      ...session.user,
      mustChangePassword: false
    };

    localStorage.setItem(
      "hcm_user",
      JSON.stringify(updatedUser)
    );

    setSession({
      ...session,
      user: updatedUser
    });
  };

  if (!session) {
    return (
      <Login
        onLogin={(newSession) => setSession(newSession)}
      />
    );
  }

  if (session.user.mustChangePassword) {
    return (
      <ChangePassword
        onComplete={completePasswordChange}
        onLogout={logout}
      />
    );
  }

  // Employee dashboard
  if (session.user.role === "employee") {
    return (
      <EmployeeDashboard
        user={session.user}
        onLogout={logout}
      />
    );
  }

  // HR panel
  if (session.user.role === "hr") {
    return (
      <main style={styles.page}>
        <header style={styles.header}>
          <div>
            <h1>HCM Lite — HR Panel</h1>
            <p>Welcome, {session.user.name}!</p>
          </div>

          <button style={styles.logout} onClick={logout}>
            Logout
          </button>
        </header>

        <EmployeeManagement />
      </main>
    );
  }

  // Admin panel
  if (session.user.role === "admin") {
    return (
      <main style={styles.page}>
        <header style={styles.header}>
          <div>
            <h1>HCM Lite — Admin Dashboard</h1>
            <p>Welcome, {session.user.name}!</p>
          </div>

          <button style={styles.logout} onClick={logout}>
            Logout
          </button>
        </header>

        <nav style={styles.nav}>
          <button
            style={
              adminPage === "dashboard"
                ? styles.activeTab
                : styles.tab
            }
            onClick={() => setAdminPage("dashboard")}
          >
            Dashboard
          </button>

          <button
            style={
              adminPage === "createHR"
                ? styles.activeTab
                : styles.tab
            }
            onClick={() => setAdminPage("createHR")}
          >
            Create HR
          </button>

          <button
            style={
              adminPage === "employees"
                ? styles.activeTab
                : styles.tab
            }
            onClick={() => setAdminPage("employees")}
          >
            Employees
          </button>
        </nav>

        <section style={styles.content}>
          {adminPage === "dashboard" && <AdminDashboard />}

          {adminPage === "createHR" && <CreateHR />}

          {adminPage === "employees" && <EmployeeManagement />}
        </section>
      </main>
    );
  }

  return (
    <div style={styles.page}>
      <p>Unknown user role. Please contact the administrator.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background: "#f3f6fb",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px"
  },
  nav: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "24px"
  },
  tab: {
    padding: "12px 18px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer"
  },
  activeTab: {
    padding: "12px 18px",
    border: "1px solid #2563eb",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer"
  },
  logout: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer"
  },
  content: {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.05)"
  }
};
