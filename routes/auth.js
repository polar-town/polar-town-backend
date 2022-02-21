const express = require("express");
const {
  handleLogin,
  handleRefreshToken,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", handleLogin);

router.post("/refresh", handleRefreshToken);

module.exports = router;
