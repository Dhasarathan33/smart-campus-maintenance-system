const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const {
    getDashboard,
    getStatusReport,
    getPriorityReport,
    getDepartmentReport,
    getRecentComplaints
} = require("../controllers/reportController");

const router = express.Router();

router.get("/dashboard", authenticateUser, getDashboard);
router.get("/status", authenticateUser, getStatusReport);
router.get("/priority", authenticateUser, getPriorityReport);
router.get("/departments", authenticateUser, getDepartmentReport);
router.get("/recent", authenticateUser, getRecentComplaints);

module.exports = router;
