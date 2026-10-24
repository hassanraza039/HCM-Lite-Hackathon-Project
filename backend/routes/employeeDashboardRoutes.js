
const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const {
  getMyDashboard
} = require("../controllers/employeeDashboardController");

router.get("/me", protect, getMyDashboard);

module.exports = router;
