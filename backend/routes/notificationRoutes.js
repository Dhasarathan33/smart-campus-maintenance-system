const express = require("express");

const {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} = require("../controllers/notificationController");

const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateUser, getNotifications);
router.put("/read-all", authenticateUser, markAllNotificationsAsRead);
router.put("/:id/read", authenticateUser, markNotificationAsRead);

module.exports = router;
