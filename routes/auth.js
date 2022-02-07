const express = require("express");
const {
  handleLogin,
  handleLogout,
  handleRefreshToken,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", handleLogin);

router.post("/logout", handleLogout);

router.get("/refresh", handleRefreshToken);

module.exports = router;
