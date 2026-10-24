
const User = require("../models/userModel");
const Employee = require("../models/employeeModel");

exports.getAdminDashboard = async (req, res) => {
  try {
    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalHR,
      totalUsers
    ] = await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ isActive: true }),
      Employee.countDocuments({ isActive: false }),
      User.countDocuments({ role: "hr", isActive: true }),
      User.countDocuments()
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        totalHR,
        totalUsers
      }
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Admin dashboard load nahi ho saka"
    });
  }
};
