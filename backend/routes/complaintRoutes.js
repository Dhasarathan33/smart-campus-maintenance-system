const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const {
    createComplaint,
    getAllComplaints,
    getMyComplaints,
    getComplaintById,
    updateComplaintStatus,
    approveComplaintCompletion,
    rejectComplaintCompletion,
    updateRepairNotes,
    assignTechnician,
    reassignTechnician,
    deleteComplaint
} = require("../controllers/complaintController");

const authenticateUser = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

// ==========================
// Multer Configuration
// ==========================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only JPG, JPEG, PNG and WEBP images are allowed"
                )
            );
        }
    }
});

// ==========================
// Create Complaint
// ==========================

router.post(
    "/",
    authenticateUser,
    upload.single("image"),
    createComplaint
);

// ==========================
// Get All Complaints
// ==========================

router.get(
    "/",
    authenticateUser,
    requireAdmin,
    getAllComplaints
);

// ==========================
// Get My Complaints
// ==========================

router.get(
    "/my",
    authenticateUser,
    getMyComplaints
);

// ==========================
// Get Complaint By ID
// ==========================

router.get(
    "/:id",
    authenticateUser,
    getComplaintById
);

// ==========================
// Technician Complaint Management
// ==========================

router.put(
    "/:id/status",
    authenticateUser,
    updateComplaintStatus
);

router.put(
    "/:id/repair-notes",
    authenticateUser,
    updateRepairNotes
);

router.put(
    "/:id/approve-completion",
    authenticateUser,
    approveComplaintCompletion
);

router.put(
    "/:id/reject-completion",
    authenticateUser,
    rejectComplaintCompletion
);

// ==========================
// Assign Technician
// ==========================

router.put(
    "/assign/:id",
    authenticateUser,
    assignTechnician
);

// ==========================
// Reassign Technician
// ==========================

router.put(
    "/reassign/:id",
    authenticateUser,
    reassignTechnician
);

// ==========================
// Delete Complaint
// ==========================

router.delete(
    "/:id",
    authenticateUser,
    requireAdmin,
    deleteComplaint
);

module.exports = router;