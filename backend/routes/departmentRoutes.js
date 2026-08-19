const express = require("express");

const router = express.Router();

const {
    getAllDepartments
} = require("../controllers/departmentController");

// ==========================
// Get All Departments
// ==========================
router.get("/", getAllDepartments);

module.exports = router;