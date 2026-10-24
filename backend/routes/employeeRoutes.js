
const express = require("express");

const { protect, authorize } = require("../middlewares/authMiddleware");
const { getMyDashboard } = require("../controllers/employeeController");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorize("employee"),
  getMyDashboard
);

module.exports = router;
