const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");
const createRateLimiter = require("../middleware/rateLimitMiddleware");

const loginRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many login attempts. Please try again later."
});

// Login Route
router.post("/login", loginRateLimiter, login);

module.exports = router;
