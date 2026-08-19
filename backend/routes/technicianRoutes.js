const express = require("express");

const router = express.Router();

const {
    getAllTechnicians,
    getTechnicianById,
    getTechniciansByDepartment,
    getAssignedComplaints,
    updateTechnician,
    deleteTechnician,
    createTechnician
} = require("../controllers/technicianController");

const authenticateUser = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

// ==========================
// Get All Technicians
// ==========================
router.get("/", authenticateUser, requireAdmin, getAllTechnicians);

// ==========================
// Get Assigned Complaints
// ==========================
router.get("/assigned-complaints", authenticateUser, getAssignedComplaints);

// ==========================
// Get Technician By ID
// ==========================
router.get("/department/:departmentId", authenticateUser, requireAdmin, getTechniciansByDepartment);

// ==========================
// Get Technician By ID
// ==========================
router.get("/:id", authenticateUser, requireAdmin, getTechnicianById);

// ==========================
// Create Technician
// ==========================
router.post("/", authenticateUser, requireAdmin, createTechnician);

// ==========================
// Update Technician
// ==========================
router.put("/:id", authenticateUser, requireAdmin, updateTechnician);

// ==========================
// Delete Technician
// ==========================
router.delete("/:id", authenticateUser, requireAdmin, deleteTechnician);

module.exports = router;
