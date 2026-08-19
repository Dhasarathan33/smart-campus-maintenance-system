const express = require("express");

const router = express.Router();

const {
    getAllAcademicDepartments
} = require("../controllers/academicDepartmentController");

// ==========================
// Get All Academic Departments
// ==========================
router.get("/", getAllAcademicDepartments);

module.exports = router;
