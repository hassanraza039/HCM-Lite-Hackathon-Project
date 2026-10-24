
const express = require("express");
const router = express.Router();

const {
  protect,
  authorize
} = require("../middlewares/authMiddleware");

const {
  getAdminDashboard
} = require("../controllers/adminController");

const {
  createHR
} = require("../controllers/hrManagementController");

// Admin dashboard
router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getAdminDashboard
);

// Admin creates an HR account
router.post(
  "/hr",
  protect,
  authorize("admin"),
  createHR
);

module.exports = router;
