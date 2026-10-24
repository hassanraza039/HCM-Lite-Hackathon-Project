
const express = require("express");
const {
  hrDashboard,
  createEmployee,
  getEmployees,
  updateEmployee,
  deactivateEmployee
} = require("../controllers/hrController");
const {
  protect,
  authorize
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorize("hr"),
  hrDashboard
);

router.get(
  "/employees",
  protect,
  authorize("hr"),
  getEmployees
);

router.post(
  "/employees",
  protect,
  authorize("hr"),
  createEmployee
);
router.put(
  "/employees/:id",
  protect,
  authorize("hr"),
  updateEmployee
);

router.patch(
  "/employees/:id/deactivate",
  protect,
  authorize("hr"),
  deactivateEmployee
);
module.exports = router;
