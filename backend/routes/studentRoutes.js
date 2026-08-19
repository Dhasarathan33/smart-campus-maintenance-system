const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

const {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentProfile,
    updateStudentProfile
} = require("../controllers/studentController");

// Logged-in student's profile
router.get("/profile", authenticateUser, getStudentProfile);
router.put("/profile", authenticateUser, updateStudentProfile);

// ==========================
// Get All Students
// ==========================
router.get("/", authenticateUser, requireAdmin, getAllStudents);

// ==========================
// Get Student By ID
// ==========================
router.get("/:id", authenticateUser, requireAdmin, getStudentById);

// ==========================
// Create Student
// ==========================
router.post("/", authenticateUser, requireAdmin, createStudent);

// ==========================
// Update Student
// ==========================
router.put("/:id", authenticateUser, requireAdmin, updateStudent);

// ==========================
// Delete Student
// ==========================
router.delete("/:id", authenticateUser, requireAdmin, deleteStudent);

module.exports = router;
