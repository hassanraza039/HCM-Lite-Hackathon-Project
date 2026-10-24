
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Check login token and verify user
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized: token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User account is inactive"
      });
    }

    // Save logged-in user in request
    req.user = user;

    console.log("AUTHENTICATED USER:", user.email);
    console.log("USER ROLE:", user.role);

    next();

  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

// Check whether user has permission for this route
const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("Logged-in user:", req.user?.email);
    console.log("Logged-in role:", req.user?.role);
    console.log("Allowed roles:", roles);

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
        actualRole: req.user?.role || null,
        allowedRoles: roles
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize
};
