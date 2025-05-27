// routes/authRoutes.js
const express = require("express");
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/login", authController.login);

// Protected (just to check token validity)
router.get("/verify-token", verifyToken, authController.verifyTokenStatus);

module.exports = router;
