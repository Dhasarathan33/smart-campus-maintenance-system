const db = require("../config/db");

// ==========================
// Get All Academic Departments
// ==========================
const getAllAcademicDepartments = (req, res) => {

    const sql = `
        SELECT
            department_id,
            department_name
        FROM academic_departments
        ORDER BY department_name ASC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });
        }

        res.status(200).json(result);

    });

};

// ==========================
// Export Controllers
// ==========================
module.exports = {
    getAllAcademicDepartments
};