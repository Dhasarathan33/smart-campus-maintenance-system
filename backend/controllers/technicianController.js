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
// Get All Technicians
// ==========================
const getAllTechnicians = (req, res) => {

    const sql = `
        SELECT
            t.technician_id,
            u.user_id,
            u.full_name,
            u.college_email,
            u.phone_number,
            d.department_id,
            d.department_name
        FROM technicians t
        JOIN users u
            ON t.user_id = u.user_id
        JOIN departments d
            ON t.department_id = d.department_id
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
// Get Technician By ID
// ==========================
const getTechnicianById = (req, res) => {

    const { id } = req.params;
    const validatedId = positiveIntegerId(id, "technician ID");

    if (validatedId.error) {
        return res.status(400).json({ message: validatedId.error });
    }

    const sql = `
        SELECT
            t.technician_id,
            t.user_id,
            u.full_name,
            u.college_email,
            u.phone_number,
            d.department_id,
            d.department_name
        FROM technicians t
        JOIN users u
            ON t.user_id = u.user_id
        JOIN departments d
            ON t.department_id = d.department_id
        WHERE t.technician_id = ?
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
                message: "Technician Not Found"
            });
        }

        res.status(200).json(result[0]);

    });

};

// ==========================
// Get Technicians By Department
// ==========================
const getTechniciansByDepartment = (req, res) => {

    const { departmentId } = req.params;
    const validatedDepartmentId = positiveIntegerId(departmentId, "department ID");

    if (validatedDepartmentId.error) {
        return res.status(400).json({ message: validatedDepartmentId.error });
    }

    const sql = `
        SELECT
            t.technician_id,
            u.full_name
        FROM technicians t
        JOIN users u
            ON t.user_id = u.user_id
        WHERE t.department_id = ?
        ORDER BY u.full_name
    `;

    db.query(sql, [validatedDepartmentId.value], (err, result) => {

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
// Get Assigned Complaints
// ==========================
const getAssignedComplaints = (req, res) => {

    const userId = req.user.id;

    if (req.user.role !== "Technician") {
        return res.status(403).json({
            message: "Access denied"
        });
    }

    const technicianSql = `
        SELECT
            technician_id
        FROM technicians
        WHERE user_id = ?
    `;

    db.query(technicianSql, [userId], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Technician Not Found"
            });
        }

        const technicianId = result[0].technician_id;

        const complaintsSql = `
            SELECT
                c.complaint_id,
                c.title,
                c.description,
                c.location,
                d.department_name,
                c.priority,
                c.status,
                c.created_at
            FROM complaints c
            JOIN departments d
                ON c.department_id = d.department_id
            WHERE c.technician_id = ?
            ORDER BY FIELD(c.priority, 'High', 'Medium', 'Low'), c.created_at DESC
        `;

        db.query(complaintsSql, [technicianId], (err, complaints) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });
            }

            res.status(200).json(complaints);

        });

    });

};

// ==========================
// Update Technician
// ==========================
const updateTechnician = (req, res) => {

    const { id } = req.params;
    const validatedId = positiveIntegerId(id, "technician ID");

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

    const technicianSql = `
        SELECT t.technician_id, t.user_id
        FROM technicians t
        INNER JOIN users u ON u.user_id = t.user_id
        WHERE t.technician_id = ?
            AND u.role = 'Technician'
    `;

    db.query(technicianSql, [validatedId.value], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Failed to validate technician" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Technician Not Found" });
        }

        const user_id = result[0].user_id;

        db.query(
            "SELECT department_id FROM departments WHERE department_id = ? LIMIT 1",
            [validatedDepartmentId.value],
            (departmentErr, departmentResult) => {
                if (departmentErr) {
                    return res.status(500).json({ message: "Failed to validate department" });
                }

                if (departmentResult.length === 0) {
                    return res.status(400).json({ message: "Invalid maintenance department ID" });
                }

                db.query(
                    "SELECT user_id FROM users WHERE college_email = ? AND user_id <> ? LIMIT 1",
                    [validatedEmail.value, user_id],
                    (duplicateErr, duplicateResult) => {
                        if (duplicateErr) {
                            return res.status(500).json({ message: "Failed to validate email" });
                        }

                        if (duplicateResult.length > 0) {
                            return res.status(409).json({ message: "Email already exists" });
                        }

                        db.beginTransaction((transactionErr) => {
                            if (transactionErr) {
                                console.log(transactionErr);
                                return res.status(500).json({ message: "Database Error" });
                            }

                            const userSql = `
                                UPDATE users
                                SET full_name = ?, college_email = ?, phone_number = ?
                                WHERE user_id = ?
                            `;

                            db.query(
                                userSql,
                                [validatedName.value, validatedEmail.value, validatedPhone.value, user_id],
                                (userErr) => {
                                    if (userErr) {
                                        return db.rollback(() => {
                                            console.log(userErr);
                                            res.status(500).json({ message: "Database Error" });
                                        });
                                    }

                                    const departmentUpdateSql = `
                                        UPDATE technicians
                                        SET department_id = ?
                                        WHERE technician_id = ?
                                    `;

                                    db.query(
                                        departmentUpdateSql,
                                        [validatedDepartmentId.value, validatedId.value],
                                        (technicianErr) => {
                                            if (technicianErr) {
                                                return db.rollback(() => {
                                                    console.log(technicianErr);
                                                    res.status(500).json({ message: "Database Error" });
                                                });
                                            }

                                            db.commit((commitErr) => {
                                                if (commitErr) {
                                                    return db.rollback(() => {
                                                        console.log(commitErr);
                                                        res.status(500).json({ message: "Database Error" });
                                                    });
                                                }

                                                res.status(200).json({
                                                    message: "Technician Updated Successfully"
                                                });
                                            });
                                        }
                                    );
                                }
                            );
                        });
                    }
                );
            }
        );
    });

};

// ==========================
// Delete Technician
// ==========================
const deleteTechnician = (req, res) => {

    const { id } = req.params;
    const validatedId = positiveIntegerId(id, "technician ID");

    if (validatedId.error) {
        return res.status(400).json({ message: validatedId.error });
    }

    const technicianSql = `
        SELECT
            technician_id,
            user_id
        FROM technicians
        WHERE technician_id = ?
    `;

    db.query(technicianSql, [validatedId.value], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Technician Not Found"
            });
        }

        const user_id = result[0].user_id;

        db.beginTransaction((err) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });
            }

            const deleteTechnicianSql = `
                DELETE FROM technicians
                WHERE technician_id = ?
            `;

            db.query(deleteTechnicianSql, [validatedId.value], (err, technicianResult) => {

                if (err) {
                    return db.rollback(() => {
                        console.log(err);

                        res.status(500).json({
                            message: "Database Error"
                        });
                    });
                }

                if (technicianResult.affectedRows === 0) {
                    return db.rollback(() => {
                        res.status(404).json({
                            message: "Technician Not Found"
                        });
                    });
                }

                const deleteUserSql = `
                    DELETE FROM users
                    WHERE user_id = ?
                `;

                        db.query(deleteUserSql, [user_id], (err) => {

                    if (err) {
                        return db.rollback(() => {
                            console.log(err);

                            res.status(500).json({
                                message: "Database Error"
                            });
                        });
                    }

                    db.commit((err) => {

                        if (err) {
                            return db.rollback(() => {
                                console.log(err);

                                res.status(500).json({
                                    message: "Database Error"
                                });
                            });
                        }

                        res.status(200).json({
                            message: "Technician Deleted Successfully"
                        });

                    });

                });

            });

        });

    });

};

// ==========================
// Create Technician
// ==========================
const createTechnician = async (req, res) => {

    const {
        full_name,
        college_email,
        phone_number,
        password,
        department_id
    } = req.body;

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

        // Check if email already exists
        const checkSql = `
            SELECT *
            FROM users
            WHERE college_email = ?
        `;

        db.query(checkSql, [validatedEmail.value], async (err, result) => {

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

            const hashedPassword = await bcrypt.hash(validatedPassword.value, 10);

            const userSql = `
                INSERT INTO users
                (
                    full_name,
                    college_email,
                    phone_number,
                    password,
                    role
                )
                VALUES (?, ?, ?, ?, 'Technician')
            `;

            db.beginTransaction((transactionErr) => {
                if (transactionErr) {
                    console.log(transactionErr);
                    return res.status(500).json({ message: "Database Error" });
                }

                db.query(
                    userSql,
                    [
                        validatedName.value,
                        validatedEmail.value,
                        validatedPhone.value,
                        hashedPassword
                    ],
                    (err, userResult) => {
                        if (err) {
                            return db.rollback(() => {
                                console.log(err);
                                res.status(500).json({ message: "Database Error" });
                            });
                        }

                        const user_id = userResult.insertId;
                        const technicianSql = `
                            INSERT INTO technicians
                            (
                                user_id,
                                department_id
                            )
                            VALUES (?, ?)
                        `;

                        db.query(
                            technicianSql,
                            [user_id, validatedDepartmentId.value],
                            (technicianErr) => {
                                if (technicianErr) {
                                    return db.rollback(() => {
                                        console.log(technicianErr);
                                        res.status(500).json({ message: "Database Error" });
                                    });
                                }

                                db.commit((commitErr) => {
                                    if (commitErr) {
                                        return db.rollback(() => {
                                            console.log(commitErr);
                                            res.status(500).json({ message: "Database Error" });
                                        });
                                    }

                                    res.status(201).json({
                                        message: "Technician Created Successfully"
                                    });
                                });
                            }
                        );
                    }
                );
            });

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ==========================
// Export Controllers
// ==========================
module.exports = {
    getAllTechnicians,
    getTechnicianById,
    getTechniciansByDepartment,
    getAssignedComplaints,
    updateTechnician,
    deleteTechnician,
    createTechnician
};
