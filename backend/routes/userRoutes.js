const express = require("express");

const {
    registerUser,
    loginUser,
    getProfile
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// AUTH ROUTES
// ===============================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);


// ===============================
// PROTECTED ROUTES
// ===============================

// Get logged-in user's profile
router.get("/profile", protect, getProfile);


module.exports = router;