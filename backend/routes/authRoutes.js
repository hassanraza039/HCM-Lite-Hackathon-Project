
const express = require("express");

const {
  setupAdmin,
  login,
  changePassword
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/setup-admin", setupAdmin);
router.post("/login", login);
router.patch("/change-password", protect, changePassword);

module.exports = router;
