const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const {
    getProfile,
    updateProfile,
    changePassword
} = require("../controllers/profileController");

const router = express.Router();

router.get("/profile", authenticateUser, getProfile);
router.put("/profile", authenticateUser, updateProfile);
router.put("/change-password", authenticateUser, changePassword);

module.exports = router;
