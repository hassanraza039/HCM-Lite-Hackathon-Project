
import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  employeeCode: "",
  name: "",
  email: "",
  password: "",
  phone: "",
  department: "",
  designation: "",
  joiningDate: "",
  basicSalary: ""
};

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("hcm_token") || ""
  );
  const [tokenInput, setTokenInput] = useState(
    localStorage.getItem("hcm_token") || ""
  );
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadEmployees = async () => {
    try {
      setLoading(true);

      const response = await api.get("/hr/employees", {
        params: {
          search,
          department,
          limit: 100,
          page: 1
        }
      });

      setEmployees(response.data.employees || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Employees load nahi huay. HR token check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadEmployees();
  }, [token, search, department]);

  const handleTokenSave = () => {
    const cleanToken = tokenInput.trim();

    if (!cleanToken) {
      setMessage("HR token enter karo.");
      return;
    }

    localStorage.setItem("hcm_token", cleanToken);
    setToken(cleanToken);
    setMessage("Token save ho gaya.");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const payload = {
        ...form,
        basicSalary: Number(form.basicSalary)
      };

      if (editingId) {
        delete payload.password;

        await api.put(`/hr/employees/${editingId}`, payload);
        setMessage("Employee update ho gaya.");
      } else {
        await api.post("/hr/employees", payload);
        setMessage("Naya employee add ho gaya.");
      }

      resetForm();
      await loadEmployees();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Save nahi hua. Details aur HR token check karo."
      );
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee._id);

    setForm({
      employeeCode: employee.employeeCode || "",
      name: employee.name || "",
      email: employee.email || "",
      password: "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      joiningDate: employee.joiningDate
        ? new Date(employee.joiningDate).toISOString().slice(0, 10)
        : "",
      basicSalary: employee.basicSalary ?? ""
    });

    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeactivate = async (employee) => {
    const confirmed = window.confirm(
      `${employee.name} ko deactivate karna hai?`
    );

    if (!confirmed) return;

    try {
      await api.patch(
        `/hr/employees/${employee._id}/deactivate`
      );

      setMessage("Employee deactivate ho gaya.");
      await loadEmployees();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Employee deactivate nahi hua."
      );
    }
  };

  return (
    <main style={styles.page}>
      <h1>HCM Lite — Employee Management</h1>
      <p>HR Dashboard: employees ko manage karein.</p>

      <section style={styles.card}>
        <h2>HR Authentication</h2>

        <label>HR JWT Token</label>
        <input
          style={styles.input}
          type="password"
          value={tokenInput}
          onChange={(event) => setTokenInput(event.target.value)}
          placeholder="Apna HR login token paste karein"
        />

        <button style={styles.button} onClick={handleTokenSave}>
          Save Token
        </button>
      </section>

      {message && (
        <p role="status" style={styles.message}>
          {message}
        </p>
      )}

      <section style={styles.card}>
        <h2>{editingId ? "Edit Employee" : "Add Employee"}</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            {[
              ["employeeCode", "Employee Code"],
              ["name", "Full Name"],
              ["email", "Email Address"],
              ["phone", "Phone Number"],
              ["department", "Department"],
              ["designation", "Designation"]
            ].map(([name, label]) => (
              <div key={name}>
                <label>{label}</label>
                <input
                  style={styles.input}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  type={name === "email" ? "email" : "text"}
                  required={name !== "phone"}
                />
              </div>
            ))}

            {!editingId && (
              <div>
                <label>Temporary Password</label>
                <input
                  style={styles.input}
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
            )}

            <div>
              <label>Joining Date</label>
              <input
                style={styles.input}
                name="joiningDate"
                type="date"
                value={form.joiningDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Basic Salary</label>
              <input
                style={styles.input}
                name="basicSalary"
                type="number"
                min="0"
                value={form.basicSalary}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button style={styles.button} type="submit">
            {editingId ? "Save Changes" : "Add Employee"}
          </button>

          {editingId && (
            <button
              style={styles.cancelButton}
              type="button"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </section>

      <section style={styles.card}>
        <h2>Employee Records</h2>

        <div style={styles.formGrid}>
          <div>
            <label>Search</label>
            <input
              style={styles.input}
              placeholder="Name, email ya employee code"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div>
            <label>Department Filter</label>
            <input
              style={styles.input}
              placeholder="Department ka naam"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
            />
          </div>
        </div>

        <button style={styles.button} onClick={loadEmployees}>
          Refresh List
        </button>

        {loading ? (
          <p>Loading employees...</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.employeeCode}</td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td>{employee.designation}</td>
                    <td>
                      {employee.isActive === false
                        ? "Inactive"
                        : "Active"}
                    </td>
                    <td>
                      <button
                        style={styles.smallButton}
                        onClick={() => handleEdit(employee)}
                      >
                        Edit
                      </button>

                      {employee.isActive !== false && (
                        <button
                          style={styles.deactivateButton}
                          onClick={() => handleDeactivate(employee)}
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {employees.length === 0 && (
                  <tr>
                    <td colSpan="7">Koi employee nahi mila.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    maxWidth: "1200px",
    margin: "30px auto",
    padding: "16px",
    fontFamily: "Arial, sans-serif",
    color: "#222"
  },
  card: {
    marginTop: "22px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fff"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginBottom: "16px"
  },
  input: {
    display: "block",
    boxSizing: "border-box",
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "12px",
    border: "1px solid #bbb",
    borderRadius: "5px"
  },
  button: {
    padding: "10px 16px",
    margin: "6px 8px 6px 0",
    background: "#176b45",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  smallButton: {
    padding: "6px 10px",
    margin: "3px",
    cursor: "pointer"
  },
  deactivateButton: {
    padding: "6px 10px",
    margin: "3px",
    background: "#b42318",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  cancelButton: {
    padding: "10px 16px",
    margin: "6px",
    cursor: "pointer"
  },
  message: {
    padding: "10px",
    background: "#f1f5f9",
    borderRadius: "6px"
  },
  tableWrap: {
    width: "100%",
    overflowX: "auto",
    marginTop: "16px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left"
  }
};
