
const User = require("../models/userModel");
const Employee = require("../models/employeeModel");
const bcrypt = require("bcryptjs");

exports.hrDashboard = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Welcome to HR Dashboard",
      hr: req.user.name
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const {
      employeeCode,
      name,
      email,
      password,
      phone,
      department,
      designation,
      joiningDate,
      basicSalary
    } = req.body;

    if (
      !employeeCode?.trim() ||
      !name?.trim() ||
      !email?.trim() ||
      typeof password !== "string" ||
      password.length < 8 ||
      !department?.trim() ||
      !designation?.trim() ||
      !joiningDate ||
      basicSalary === undefined ||
      basicSalary === null ||
      basicSalary === "" ||
      !Number.isFinite(Number(basicSalary)) ||
      Number(basicSalary) < 0
    ) {
      return res.status(400).json({
        message: "Valid employee details and password (8+ characters) are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = employeeCode.trim();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    const existingEmployee = await Employee.findOne({
      employeeCode: normalizedCode
    });

    if (existingEmployee) {
      return res.status(409).json({
        message: "Employee code already exists"
      });
    }

    const parsedDate = new Date(joiningDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid joining date"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "employee",
      mustChangePassword: true
    });

    try {
      const employee = await Employee.create({
        employeeCode: normalizedCode,
        name: name.trim(),
        email: normalizedEmail,
        phone: typeof phone === "string" ? phone.trim() : "",
        department: department.trim(),
        designation: designation.trim(),
        joiningDate: parsedDate,
        basicSalary: Number(basicSalary),
        user: user._id
      });

      return res.status(201).json({
        success: true,
        message: "Employee created successfully",
        employee: {
          id: employee._id,
          employeeCode: employee.employeeCode,
          name: employee.name,
          email: employee.email,
          department: employee.department,
          designation: employee.designation,
          joiningDate: employee.joiningDate,
          basicSalary: employee.basicSalary
        }
      });
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      throw error;
    }
  } catch (error) {
    console.error("CREATE EMPLOYEE ERROR:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Employee code, email or user already exists"
      });
    }

    return res.status(500).json({
      message: "Employee creation failed"
    });
  }
};

const getEmployees = async (req, res) => {
  try {
    const Employee = require("../models/employeeModel");

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const search = (req.query.search || "").trim();
    const department = (req.query.department || "").trim();

    const filter = {};

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
        { employeeCode: { $regex: safeSearch, $options: "i" } }
      ];
    }

    if (department) {
      filter.department = department;
    }

    const [employees, total] = await Promise.all([
      Employee.find(filter)
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Employee.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("GET EMPLOYEES ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees"
    });
  }
};

exports.getEmployees = getEmployees;
exports.updateEmployee = async (req, res) => {
  // Aapka complete updateEmployee function yahan hoga
};

exports.deactivateEmployee = async (req, res) => {
  // Aapka complete deactivateEmployee function yahan hoga
};