const db = require("../config/db");
const { positiveIntegerId } = require("../utils/validation");

const requireNotificationRole = (req, res) => {
    if (!['Admin', 'Technician', 'Student'].includes(req.user?.role)) {
        res.status(403).json({
            message: "Only administrators, technicians, and students can access notifications"
        });
        return false;
    }

    return true;
};

const getNotifications = (req, res) => {
    if (!requireNotificationRole(req, res)) return;

    const userId = req.user.id;
    const sql = `
        SELECT
            notification_id,
            complaint_id,
            message,
            type,
            is_read,
            created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC, notification_id DESC
    `;

    db.query(sql, [userId], (err, notifications) => {
        if (err) {
            console.log("Get Notifications Error:", err);
            return res.status(500).json({
                message: "Failed to load notifications",
                error: err.message
            });
        }

        const unreadCount = notifications.filter((notification) => !notification.is_read).length;

        res.status(200).json({
            notifications,
            unreadCount
        });
    });
};

const markNotificationAsRead = (req, res) => {
    if (!requireNotificationRole(req, res)) return;

    const userId = req.user.id;
    const notificationId = req.params.id;
    const validatedNotificationId = positiveIntegerId(notificationId, "notification ID");

    if (validatedNotificationId.error) {
        return res.status(400).json({ message: validatedNotificationId.error });
    }
    const sql = `
        UPDATE notifications
        SET is_read = 1
        WHERE notification_id = ? AND user_id = ?
    `;

    db.query(sql, [validatedNotificationId.value, userId], (err, result) => {
        if (err) {
            console.log("Mark Notification Read Error:", err);
            return res.status(500).json({
                message: "Failed to mark notification as read",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Notification Not Found"
            });
        }

        res.status(200).json({
            message: "Notification marked as read"
        });
    });
};

const markAllNotificationsAsRead = (req, res) => {
    if (!requireNotificationRole(req, res)) return;

    const userId = req.user.id;
    const sql = `
        UPDATE notifications
        SET is_read = 1
        WHERE user_id = ? AND is_read = 0
    `;

    db.query(sql, [userId], (err) => {
        if (err) {
            console.log("Mark All Notifications Read Error:", err);
            return res.status(500).json({
                message: "Failed to mark notifications as read",
                error: err.message
            });
        }

        res.status(200).json({
            message: "All notifications marked as read"
        });
    });
};

module.exports = {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
};
