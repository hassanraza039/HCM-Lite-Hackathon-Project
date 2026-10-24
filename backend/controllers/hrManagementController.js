
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.createHR = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, valid email aur minimum 8 characters ka password required hai"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing account
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Ye email pehle se registered hai"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create HR account
    const hr = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "hr",
      mustChangePassword: true
    });

    return res.status(201).json({
      success: true,
      message: "HR account successfully create ho gaya",
      user: {
        id: hr._id,
        name: hr.name,
        email: hr.email,
        role: hr.role
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Ye email pehle se registered hai"
      });
    }

    console.error("CREATE HR ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "HR account create nahi ho saka"
    });
  }
};
