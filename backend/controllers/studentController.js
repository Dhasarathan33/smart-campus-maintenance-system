const db = require("../config/db");
const bcrypt = require("bcryptjs");
const {
    positiveIntegerId,
    requiredTrimmedString,
    email,
    phone,
    password: validatePassword
} = require("../utils/validation");

// ==========================
// Get All Students
// ==========================
const getAllStudents = (req, res) => {

    const sql = `
        SELECT
            u.user_id,
            u.full_name,
            u.college_email,
            u.phone_number,
            ad.department_id,
            ad.department_name
        FROM users u
        LEFT JOIN academic_departments ad
            ON u.department_id = ad.department_id
        WHERE u.role = 'Student'
        ORDER BY u.full_name ASC
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
// Get Student By ID
// ==========================
const getStudentById = (req, res) => {

    const { id } = req.params;
    const validatedId = positiveIntegerId(id, "student ID");

    if (validatedId.error) {
        return res.status(400).json({ message: validatedId.error });
    }

    const sql = `
        SELECT
            u.user_id,
            u.full_name,
            u.college_email,
            u.phone_number,
            ad.department_id,
            ad.department_name
        FROM users u
        LEFT JOIN academic_departments ad
            ON u.department_id = ad.department_id
        WHERE u.user_id = ?
        AND u.role = 'Student'
    `;

    db.query(sql, [validatedId.value], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "Student Not Found"
            });

        }

        res.status(200).json(result[0]);

    });

};

// ==========================
// Create Student
// ==========================
const createStudent = async (req, res) => {

    const {
        full_name,
        college_email,
        phone_number,
        password,
        department_id
    } = req.body || {};

    const validatedName = requiredTrimmedString(full_name, "Full Name", 100);
    const validatedEmail = email(college_email, "Email");
    const validatedPhone = phone(phone_number);
    const validatedPassword = validatePassword(password);
    const validatedDepartmentId = positiveIntegerId(department_id, "department ID");

    for (const validation of [validatedName, validatedEmail, validatedPhone, validatedPassword, validatedDepartmentId]) {
        if (validation.error) {
            return res.status(400).json({ message: validation.error });
        }
    }

    try {

        db.query(
            "SELECT * FROM users WHERE college_email = ?",
            [validatedEmail.value],
            async (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                            message: "Database Error"
                    });

                }

                if (result.length > 0) {

                    return res.status(400).json({
                        message: "Email already exists"
                    });

                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const sql = `
                    INSERT INTO users
                    (
                        full_name,
                        college_email,
                        phone_number,
                        password,
                        role,
                        department_id
                    )
                    VALUES
                    (?, ?, ?, ?, 'Student', ?)
                `;

                db.query(
                    sql,
                    [
                        validatedName.value,
                        validatedEmail.value,
                        validatedPhone.value,
                        hashedPassword,
                        validatedDepartmentId.value
                    ],
                    (err) => {

                    if (err) {

                            console.log(err);

                            return res.status(500).json({
                                message: "Database Error"
                            });

                        }

                        res.status(201).json({
                            message: "Student Created Successfully"
                        });

                    }
                );

            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ==========================
// Update Student
// ==========================
const updateStudent = (req, res) => {

    const { id } = req.params;
    const validatedId = positiveIntegerId(id, "student ID");

    const {
        full_name,
        college_email,
        phone_number,
        department_id
    } = req.body || {};

    const validatedName = requiredTrimmedString(full_name, "Full Name", 100);
    const validatedEmail = email(college_email, "Email");
    const validatedPhone = phone(phone_number);
    const validatedDepartmentId = positiveIntegerId(department_id, "department ID");

    for (const validation of [validatedId, validatedName, validatedEmail, validatedPhone, validatedDepartmentId]) {
        if (validation.error) {
            return res.status(400).json({ message: validation.error });
        }
    }

    const sql = `
        UPDATE users
        SET
            full_name = ?,
            college_email = ?,
            phone_number = ?,
            department_id = ?
        WHERE user_id = ?
            AND role = 'Student'
    `;

    db.query(
        "SELECT user_id FROM users WHERE user_id = ? AND role = 'Student' LIMIT 1",
        [validatedId.value],
        (studentErr, studentResult) => {
            if (studentErr) {
                return res.status(500).json({ message: "Failed to validate student" });
            }

            if (studentResult.length === 0) {
                return res.status(404).json({ message: "Student Not Found" });
            }

            db.query(
                "SELECT department_id FROM academic_departments WHERE department_id = ? LIMIT 1",
                [validatedDepartmentId.value],
                (departmentErr, departmentResult) => {
                    if (departmentErr) {
                        return res.status(500).json({ message: "Failed to validate department" });
                    }

                    if (departmentResult.length === 0) {
                        return res.status(400).json({ message: "Invalid academic department ID" });
                    }

                    db.query(
                        "SELECT user_id FROM users WHERE college_email = ? AND user_id <> ? LIMIT 1",
                        [validatedEmail.value, validatedId.value],
                        (duplicateErr, duplicateResult) => {
                            if (duplicateErr) {
                                return res.status(500).json({ message: "Failed to validate email" });
                            }

                            if (duplicateResult.length > 0) {
                                return res.status(409).json({ message: "Email already exists" });
                            }

                            db.query(
                                sql,
                                [
                                    validatedName.value,
                                    validatedEmail.value,
                                    validatedPhone.value,
                                    validatedDepartmentId.value,
                                    validatedId.value
                                ],
                                (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).json({ message: "Failed to update student" });
                                    }

                                    if (result.affectedRows === 0) {
                                        return res.status(404).json({ message: "Student Not Found" });
                                    }

                                    res.status(200).json({ message: "Student Updated Successfully" });
                                }
                            );
                        }
                    );
                }
            );
        }
    );

};

// ==========================
// Delete Student
// ==========================
const deleteStudent = (req, res) => {

    const { id } = req.params;
    const validatedId = positiveIntegerId(id, "student ID");

    if (validatedId.error) {
        return res.status(400).json({ message: validatedId.error });
    }

    db.query(
        `
        DELETE FROM users
        WHERE user_id = ?
        AND role = 'Student'
        `,
        [validatedId.value],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: err.message
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Student Not Found"
                });

            }

            res.json({
                message: "Student Deleted Successfully"
            });

        }
    );

};

// ==========================
// Get Logged-in Student Profile
// ==========================
const getStudentProfile = (req, res) => {

    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    if (role !== "Student") {
        return res.status(403).json({
            message: "Access denied"
        });
    }

    const sql = `
        SELECT
            u.full_name,
            u.college_email,
            u.phone_number,
            ad.department_name AS academic_department,
            u.role
        FROM users u
        LEFT JOIN academic_departments ad
            ON u.department_id = ad.department_id
        WHERE u.user_id = ?
            AND u.role = 'Student'
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.log("Get Student Profile Error:", err);

            return res.status(500).json({
                message: "Failed to load profile",
                error: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Student Not Found"
            });
        }

        res.status(200).json(result[0]);

    });

};

// ==========================
// Update Logged-in Student Profile
// ==========================
const updateStudentProfile = (req, res) => {

    const userId = req.user?.id;
    const role = req.user?.role;

    const fullName = requiredTrimmedString(req.body?.full_name, "Full Name", 100);

    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    if (role !== "Student") {
        return res.status(403).json({
            message: "Access denied"
        });
    }

    if (fullName.error) {
        return res.status(400).json({ message: fullName.error });
    }

    const validatedPhone = phone(req.body?.phone_number);
    if (validatedPhone.error) {
        return res.status(400).json({
            message: validatedPhone.error
        });
    }

    const sql = `
        UPDATE users
        SET
            full_name = ?,
            phone_number = ?
        WHERE user_id = ?
            AND role = 'Student'
    `;

    db.query(sql, [fullName.value, validatedPhone.value, userId], (err, result) => {

        if (err) {
            console.log("Update Student Profile Error:", err);

            return res.status(500).json({
                message: "Failed to update profile",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student Not Found"
            });
        }

        res.status(200).json({
            message: "Profile Updated Successfully"
        });

    });

};

// ==========================
// Export Controllers
// ==========================
module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentProfile,
    updateStudentProfile
};
