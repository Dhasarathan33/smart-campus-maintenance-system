const db = require("../config/db");

// ==========================
// Get All Maintenance Departments
// ==========================
const getAllDepartments = (req, res) => {

    const sql = `
        SELECT
            department_id,
            department_name
        FROM departments
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
    getAllDepartments
};