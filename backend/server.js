const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./config/db");

// ========================
// Routes
// ========================
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const technicianRoutes = require("./routes/technicianRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const academicDepartmentRoutes = require("./routes/academicDepartmentRoutes");
const studentRoutes = require("./routes/studentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const profileRoutes = require("./routes/profileRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const createRateLimiter = require("./middleware/rateLimitMiddleware");

const app = express();

// ========================
// Middleware
// ========================
const configuredOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    ...configuredOrigins
]);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Origin is not allowed by CORS"));
    }
}));

app.use(express.json());

// ========================
// Uploaded Images
// ========================

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// ========================
// API Rate Limiting
// ========================

app.use(
    "/api",
    createRateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 300,
        message: "Too many requests. Please try again later."
    })
);

// ========================
// API Routes
// ========================

// Authentication
app.use("/api/auth", authRoutes);

// Complaints
app.use("/api/complaints", complaintRoutes);

// Technicians
app.use("/api/technicians", technicianRoutes);

// Maintenance Departments
app.use("/api/departments", departmentRoutes);

// Academic Departments
app.use("/api/academic-departments", academicDepartmentRoutes);

// Students
app.use("/api/students", studentRoutes);

// Reports
app.use("/api/reports", reportRoutes);

// Shared profile and password settings
app.use("/api", profileRoutes);

// Notifications
app.use("/api/notifications", notificationRoutes);

// ========================
// Test Route
// ========================

app.get("/", (req, res) => {
    res.send("🚀 Smart Campus Maintenance Backend is Running");
});

// ========================
// Start Server
// ========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});