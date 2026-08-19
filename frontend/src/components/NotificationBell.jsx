import { useCallback, useEffect, useRef, useState } from "react";
import { FaBell, FaCheckDouble } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead
} from "../services/notificationService";

function formatNotificationTime(value) {
    const date = new Date(value);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString();
}

function NotificationBell() {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const role = localStorage.getItem("role") || "Admin";
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadNotifications = useCallback(async () => {
        try {
            const data = await getNotifications();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
            setError("");
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to load notifications.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const initialLoad = setTimeout(loadNotifications, 0);
        const refreshInterval = setInterval(loadNotifications, 30000);
        return () => {
            clearTimeout(initialLoad);
            clearInterval(refreshInterval);
        };
    }, [loadNotifications]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const handleNotificationClick = async (notification) => {
        if (!notification.is_read) {
            try {
                await markNotificationAsRead(notification.notification_id);
                setNotifications((current) => current.map((item) => (
                    item.notification_id === notification.notification_id
                        ? { ...item, is_read: 1 }
                        : item
                )));
                setUnreadCount((current) => Math.max(0, current - 1));
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to update notification.");
                return;
            }
        }

        if (notification.complaint_id) {
            setIsOpen(false);
            const complaintPath = role === "Technician"
                ? "/technician-complaint"
                : role === "Student"
                    ? "/student-complaint"
                    : "/admin-complaint";
            navigate(`${complaintPath}/${notification.complaint_id}`);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;

        try {
            await markAllNotificationsAsRead();
            setNotifications((current) => current.map((item) => ({ ...item, is_read: 1 })));
            setUnreadCount(0);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to update notifications.");
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                aria-label="Notifications"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((current) => !current)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-700"
            >
                <FaBell />
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-600 px-1 text-center text-xs font-bold leading-5 text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-3 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:w-96">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <h2 className="font-semibold text-gray-800">Notifications</h2>
                        <button
                            type="button"
                            onClick={handleMarkAllAsRead}
                            disabled={unreadCount === 0}
                            className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 disabled:cursor-not-allowed disabled:text-gray-400"
                        >
                            <FaCheckDouble />
                            Mark all as read
                        </button>
                    </div>

                    {error && <p className="border-b border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">{error}</p>}

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <p className="px-4 py-8 text-center text-sm text-gray-500">Loading notifications...</p>
                        ) : notifications.length === 0 ? (
                            <p className="px-4 py-8 text-center text-sm text-gray-500">No notifications yet</p>
                        ) : (
                            notifications.map((notification) => (
                                <button
                                    type="button"
                                    key={notification.notification_id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`block w-full border-b border-gray-100 px-4 py-3 text-left transition hover:bg-blue-50 ${notification.is_read ? "bg-white" : "bg-blue-50/70"}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.is_read ? "bg-gray-300" : "bg-blue-600"}`} />
                                        <span className="min-w-0 flex-1">
                                            <span className={`block text-sm ${notification.is_read ? "font-normal text-gray-600" : "font-semibold text-gray-800"}`}>
                                                {notification.message}
                                            </span>
                                            <span className="mt-1 block text-xs text-gray-400">
                                                {formatNotificationTime(notification.created_at)}
                                            </span>
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
