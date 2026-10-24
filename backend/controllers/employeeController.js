
const Employee = require("../models/employeeModel");

exports.getMyDashboard = async (req, res) => {
  try {
    // Password change required?
    if (req.user.mustChangePassword) {
      return res.status(403).json({
        success: false,
        mustChangePassword: true,
        message: "Dashboard access se pehle password change karein"
      });
    }

    // Find only the logged-in employee's profile
    const employee = await Employee.findOne({
      user: req.user._id
    })
      .select(
        "employeeCode name email phone department designation joiningDate isActive"
      )
      .lean();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile nahi mili. Admin/HR se contact karein."
      });
    }

    return res.status(200).json({
      success: true,
      employee
    });

  } catch (error) {
    console.error("EMPLOYEE DASHBOARD ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Dashboard load nahi ho saka"
    });
  }
};
