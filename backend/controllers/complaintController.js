const db = require("../config/db");
const {
    positiveIntegerId,
    requiredTrimmedString
} = require("../utils/validation");

const COMPLAINT_TITLE_MAX_LENGTH = 200;
const COMPLAINT_DESCRIPTION_MAX_LENGTH = 2000;
const COMPLAINT_LOCATION_MAX_LENGTH = 255;

// ==========================
// Create Complaint
// ==========================
const createComplaint = (req, res) => {
    const userId = req.user?.id;
    const role = req.user?.role;

    const {
        department_id,
        title,
        description,
        location
    } = req.body;

    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    if (role !== "Student") {
        return res.status(403).json({
            message: "Only students can create complaints"
        });
    }

    const validatedDepartmentId = positiveIntegerId(
        department_id,
        "department ID"
    );

    const validatedTitle = requiredTrimmedString(
        title,
        "Title",
        COMPLAINT_TITLE_MAX_LENGTH
    );

    const validatedDescription = requiredTrimmedString(
        description,
        "Description",
        COMPLAINT_DESCRIPTION_MAX_LENGTH
    );

    const validatedLocation = requiredTrimmedString(
        location,
        "Location",
        COMPLAINT_LOCATION_MAX_LENGTH
    );

    for (const validation of [
        validatedDepartmentId,
        validatedTitle,
        validatedDescription,
        validatedLocation
    ]) {
        if (validation.error) {
            return res.status(400).json({
                message: validation.error
            });
        }
    }

    // Uploaded image path
    const image = req.file
        ? `/uploads/${req.file.filename}`
        : null;

    const sql = `
        INSERT INTO complaints
        (
            user_id,
            department_id,
            title,
            description,
            location,
            image,
            priority,
            status,
            technician_id,
            repair_notes,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, 'Low', 'Pending', NULL, NULL, CURRENT_TIMESTAMP)
    `;

    db.query(
        "SELECT department_id FROM departments WHERE department_id = ?",
        [validatedDepartmentId.value],
        (departmentErr, departmentResult) => {

            if (departmentErr) {
                console.log(
                    "Create Complaint Department Lookup Error:",
                    departmentErr
                );

                return res.status(500).json({
                    message: "Failed to validate complaint department"
                });
            }

            if (departmentResult.length === 0) {
                return res.status(400).json({
                    message: "Invalid department ID"
                });
            }

            db.query(
                sql,
                [
                    userId,
                    validatedDepartmentId.value,
                    validatedTitle.value,
                    validatedDescription.value,
                    validatedLocation.value,
                    image
                ],
                (err, result) => {

                    if (err) {
                        console.log(
                            "Create Complaint Error:",
                            err
                        );

                        return res.status(500).json({
                            message: "Failed to create complaint"
                        });
                    }

                    const complaintId = result.insertId;

                    const notificationSql = `
                        INSERT INTO notifications
                        (
                            user_id,
                            complaint_id,
                            message,
                            type,
                            is_read
                        )
                        SELECT
                            u.user_id,
                            ?,
                            ?,
                            'info',
                            0
                        FROM users u
                        WHERE u.role = 'Admin'
                    `;

                    db.query(
                        notificationSql,
                        [
                            complaintId,
                            `New complaint #${complaintId} requires your attention.`
                        ],
                        (notificationErr) => {

                            if (notificationErr) {
                                console.log(
                                    "Create Complaint Notification Error:",
                                    notificationErr
                                );

                                return res.status(500).json({
                                    message:
                                        "Complaint created, but failed to create admin notifications",
                                    error: notificationErr.message
                                });
                            }

                            return res.status(201).json({
                                message: "Complaint Created Successfully"
                            });
                        }
                    );
                }
            );
        }
    );
};

// ==========================
// Get All Complaints
// ==========================
const getAllComplaints = (req, res) => {

    const sql = `
        SELECT
            c.complaint_id,
            c.user_id,
            u.full_name,
            d.department_name,
            c.title,
            c.description,
            c.location,
            c.priority,
            c.status,
            c.created_at
        FROM complaints c
        JOIN users u
            ON c.user_id = u.user_id
        JOIN departments d
            ON c.department_id = d.department_id
        ORDER BY c.created_at DESC
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
// Get Logged-in Student Complaints
// ==========================
const getMyComplaints = (req, res) => {

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
            c.complaint_id,
            c.title,
            d.department_name,
            c.location,
            c.priority,
            c.status,
            c.created_at
        FROM complaints c
        JOIN departments d
            ON c.department_id = d.department_id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
    `;

    db.query(sql, [userId], (err, result) => {

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
// Get Complaint By ID
// ==========================
const getComplaintById = (req, res) => {

    const { id } = req.params;
    const validatedId = positiveIntegerId(id, "complaint ID");
    const userId = req.user?.id;
    const role = req.user?.role;

    if (validatedId.error) {
        return res.status(400).json({ message: validatedId.error });
    }

    if (!["Admin", "Student", "Technician"].includes(role)) {
        return res.status(403).json({
            message: "You are not authorized to view this complaint"
        });
    }

    const buildResponseQuery = (sql, params) => {

        db.query(sql, params, (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Complaint Not Found"
                });
            }

            res.status(200).json(result[0]);

        });

    };

    const baseSql = `
        SELECT
            c.complaint_id,
            c.department_id,
            u.full_name,
            c.title,
            c.description,
            d.department_name,
            c.location,
            c.image,
            c.priority,
            c.status,
            c.updated_at,
            c.repair_notes,
            c.assigned_at,
            c.started_at,
            c.completed_at,
            c.completion_submitted_at,
            c.verified_at,
            c.verified_by,
            c.verification_notes,
            c.created_at,
            tu.full_name AS technician_name
        FROM complaints c
        JOIN users u
            ON c.user_id = u.user_id
        JOIN departments d
            ON c.department_id = d.department_id
        LEFT JOIN technicians t
            ON c.technician_id = t.technician_id
        LEFT JOIN users tu
            ON t.user_id = tu.user_id
        WHERE c.complaint_id = ?
    `;

    if (role === "Student") {

        const studentComplaintSql = `
            SELECT
                c.complaint_id,
                c.department_id,
                u.full_name,
                c.title,
                c.description,
                d.department_name,
                c.location,
            c.image,
            c.priority,
            c.status,
                c.updated_at,
                c.repair_notes,
                c.created_at,
                tu.full_name AS technician_name
            FROM complaints c
            JOIN users u
                ON c.user_id = u.user_id
            JOIN departments d
                ON c.department_id = d.department_id
            LEFT JOIN technicians t
                ON c.technician_id = t.technician_id
            LEFT JOIN users tu
                ON t.user_id = tu.user_id
            WHERE c.complaint_id = ?
                AND c.user_id = ?
        `;

        buildResponseQuery(studentComplaintSql, [validatedId.value, userId]);

        return;

    }

    if (role === "Technician") {

        const technicianSql = `
            SELECT
                technician_id
            FROM technicians
            WHERE user_id = ?
        `;

        db.query(technicianSql, [userId], (err, technicianResult) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (technicianResult.length === 0) {
                return res.status(404).json({
                    message: "Technician Not Found"
                });
            }

            const technicianComplaintSql = `
            SELECT
                c.complaint_id,
                c.department_id,
                u.full_name,
                u.full_name AS student_name,
                c.title,
                    c.description,
                    d.department_name,
                    c.location,
                    c.image,
                    c.priority,
                    c.status,
                c.updated_at,
                c.repair_notes,
                c.started_at,
                c.completed_at,
                c.completion_submitted_at,
                c.verified_at,
                c.verified_by,
                c.verification_notes,
                c.created_at,
                    tu.full_name AS technician_name
            FROM complaints c
            JOIN users u
                ON c.user_id = u.user_id
            JOIN departments d
                    ON c.department_id = d.department_id
                LEFT JOIN technicians t
                    ON c.technician_id = t.technician_id
                LEFT JOIN users tu
                    ON t.user_id = tu.user_id
                WHERE c.complaint_id = ?
                    AND c.technician_id = ?
            `;

            buildResponseQuery(technicianComplaintSql, [validatedId.value, technicianResult[0].technician_id]);

        });

        return;
    }

    buildResponseQuery(baseSql, [validatedId.value]);

};

// ==========================
// Update Complaint Status (Technician)
// ==========================
const createStartedWorkNotification = (studentUserId, complaintId, res, status) => {

    const notificationSql = `
        INSERT INTO notifications
        (
            user_id,
            complaint_id,
            message,
            type,
            is_read
        )
        VALUES (?, ?, ?, 'status', 0)
    `;

    db.query(
        notificationSql,
        [
            studentUserId,
            complaintId,
            `Technician has started working on Complaint #${complaintId}.`
        ],
        (notificationErr) => {
            if (notificationErr) {
                console.log("Create Started Work Notification Error:", notificationErr);
                return res.status(500).json({
                    message: "Complaint status updated, but student notification could not be created",
                    error: notificationErr.message
                });
            }

            res.status(200).json({
                message: "Complaint Updated Successfully",
                status
            });
        }
    );
};

const createVerificationNotifications = (complaintId, res, status) => {

    const notificationSql = `
        INSERT INTO notifications
        (
            user_id,
            complaint_id,
            message,
            type,
            is_read
        )
        SELECT
            u.user_id,
            ?,
            ?,
            'verification',
            0
        FROM users u
        WHERE u.role = 'Admin'
    `;

    db.query(
        notificationSql,
        [
            complaintId,
            `Complaint #${complaintId} is awaiting verification.`
        ],
        (notificationErr) => {
            if (notificationErr) {
                console.log("Create Verification Notification Error:", notificationErr);
                return res.status(500).json({
                    message: "Complaint submitted, but Admin notifications could not be created",
                    error: notificationErr.message
                });
            }

            res.status(200).json({
                message: "Complaint Submitted for Verification",
                status
            });
        }
    );
};

const createUserNotification = (userId, complaintId, message, type, callback) => {

    const notificationSql = `
        INSERT INTO notifications
        (
            user_id,
            complaint_id,
            message,
            type,
            is_read
        )
        VALUES (?, ?, ?, ?, 0)
    `;

    db.query(
        notificationSql,
        [userId, complaintId, message, type],
        callback
    );
};

const updateComplaintStatus = (req, res) => {

    const userId = req.user?.id;
    const role = req.user?.role;
    const { id } = req.params;
    const { status } = req.body;
    const validatedId = positiveIntegerId(id, "complaint ID");
    const repairNotes = String(req.body?.repair_notes || "").trim();
    const allowedStatuses = ["In Progress", "Completed", "Awaiting Verification"];

    if (validatedId.error) {
        return res.status(400).json({ message: validatedId.error });
    }

    if (!userId || role !== "Technician") {
        return res.status(403).json({
            message: "Only technicians can update complaint status"
        });
    }

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid technician complaint status"
        });
    }

    const complaintSql = `
        SELECT
            c.status,
            c.priority,
            c.repair_notes,
            c.user_id
        FROM complaints c
        JOIN technicians t
            ON c.technician_id = t.technician_id
        WHERE c.complaint_id = ?
            AND t.user_id = ?
    `;

    db.query(complaintSql, [validatedId.value, userId], (err, complaintResult) => {

        if (err) {
            console.log("Update Complaint Status Lookup Error:", err);

            return res.status(500).json({
                message: "Failed to update complaint status"
            });
        }

        if (complaintResult.length === 0) {
            return res.status(404).json({
                message: "Complaint Not Found or not assigned to you"
            });
        }

        const complaint = complaintResult[0];
        const priority = complaint.priority || "Low";
        const currentNotes = repairNotes || String(complaint.repair_notes || "").trim();
        const isVerificationPriority = ["Medium", "High"].includes(priority);
        const validTransition = (
            (complaint.status === "Assigned" && status === "In Progress") ||
            (complaint.status === "In Progress" && status === "Completed" && priority === "Low") ||
            (complaint.status === "In Progress" && status === "Awaiting Verification" && isVerificationPriority)
        );

        if (!validTransition) {
            return res.status(400).json({
                message: "Invalid complaint status transition"
            });
        }

        if (["Completed", "Awaiting Verification"].includes(status) && !currentNotes) {
            return res.status(400).json({
                message: "Repair Notes are required before completing or submitting the complaint"
            });
        }

        const sql = `
            UPDATE complaints c
            JOIN technicians t
                ON c.technician_id = t.technician_id
            SET
                c.status = ?,
                c.repair_notes = CASE
                    WHEN ? <> '' THEN ?
                    ELSE c.repair_notes
                END,
                c.started_at = CASE
                    WHEN ? = 'In Progress' AND c.started_at IS NULL THEN CURRENT_TIMESTAMP
                    ELSE c.started_at
                END,
                c.completed_at = CASE
                    WHEN ? = 'Completed' AND c.priority = 'Low' THEN CURRENT_TIMESTAMP
                    ELSE c.completed_at
                END,
                c.completion_submitted_at = CASE
                    WHEN ? = 'Awaiting Verification' THEN CURRENT_TIMESTAMP
                    ELSE c.completion_submitted_at
                END
            WHERE c.complaint_id = ?
                AND t.user_id = ?
                AND c.status = ?
        `;

        db.query(sql, [
            status,
            repairNotes,
            repairNotes,
            status,
            status,
            status,
            validatedId.value,
            userId,
            complaint.status
        ], (err, result) => {

            if (err) {
                console.log("Update Complaint Status Error:", err);

                return res.status(500).json({
                    message: "Failed to update complaint status"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(400).json({
                    message: "Complaint status could not be updated"
                });
            }

            if (complaint.status === "Assigned" && status === "In Progress") {
                return createStartedWorkNotification(complaint.user_id, validatedId.value, res, status);
            }

            if (complaint.status === "In Progress" && status === "Awaiting Verification") {
                return createVerificationNotifications(validatedId.value, res, status);
            }

            if (complaint.status === "In Progress" && status === "Completed" && priority === "Low") {
                return createUserNotification(
                    complaint.user_id,
                    validatedId.value,
                    `Complaint #${validatedId.value} has been completed.`,
                    "completion",
                    (notificationErr) => {
                        if (notificationErr) {
                            console.log("Create Completion Notification Error:", notificationErr);
                            return res.status(500).json({
                                message: "Complaint completed, but student notification could not be created",
                                error: notificationErr.message
                            });
                        }

                        res.status(200).json({
                            message: "Complaint Updated Successfully",
                            status
                        });
                    }
                );
            }

            res.status(200).json({
                message: status === "Awaiting Verification"
                    ? "Complaint Submitted for Verification"
                    : "Complaint Updated Successfully",
                status
            });

        });

    });

};

// ==========================
// Approve Complaint Completion (Admin)
// ==========================
const approveComplaintCompletion = (req, res) => {

    const role = req.user?.role;
    const userId = req.user?.id;
    const { id } = req.params;
    const validatedId = positiveIntegerId(id, "complaint ID");

    if (validatedId.error) {
        return res.status(400).json({ message: validatedId.error });
    }

    if (role !== "Admin" || !userId) {
        return res.status(403).json({
            message: "Only administrators can approve complaint completion"
        });
    }

    const sql = `
        UPDATE complaints
        SET
            status = 'Completed',
            verified_at = CURRENT_TIMESTAMP,
            verified_by = ?,
            completed_at = CURRENT_TIMESTAMP
        WHERE complaint_id = ?
            AND status = 'Awaiting Verification'
    `;

    db.query(sql, [userId, validatedId.value], (err, result) => {

        if (err) {
            console.log("Approve Complaint Completion Error:", err);

            return res.status(500).json({
                message: "Failed to approve complaint completion"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: "Complaint is not awaiting verification"
            });
        }

        db.query(
            "SELECT user_id FROM complaints WHERE complaint_id = ?",
            [validatedId.value],
            (studentErr, studentResult) => {
                if (studentErr) {
                    console.log("Approve Complaint Student Lookup Error:", studentErr);
                    return res.status(500).json({
                        message: "Complaint approved, but student notification could not be created",
                        error: studentErr.message
                    });
                }

                if (studentResult.length === 0) {
                    return res.status(500).json({
                        message: "Complaint approved, but notification recipient was not found"
                    });
                }

                createUserNotification(
                    studentResult[0].user_id,
                    validatedId.value,
                    `Complaint #${validatedId.value} has been approved and completed.`,
                    "approval",
                    (notificationErr) => {
                        if (notificationErr) {
                            console.log("Create Approval Notification Error:", notificationErr);
                            return res.status(500).json({
                                message: "Complaint approved, but student notification could not be created",
                                error: notificationErr.message
                            });
                        }

                        res.status(200).json({
                            message: "Complaint marked as completed.",
                            status: "Completed"
                        });
                    }
                );
            }
        );

    });

};

// ==========================
// Reject Complaint Completion (Admin)
// ==========================
const rejectComplaintCompletion = (req, res) => {

    const role = req.user?.role;
    const { id } = req.params;
    const validatedId = positiveIntegerId(id, "complaint ID");
    const verificationNotes = String(req.body.verification_notes || "").trim();

    if (validatedId.error) {
        return res.status(400).json({ message: validatedId.error });
    }

    if (role !== "Admin") {
        return res.status(403).json({
            message: "Only administrators can reject complaint completion"
        });
    }

    if (!verificationNotes) {
        return res.status(400).json({
            message: "A verification reason is required"
        });
    }

    const sql = `
        UPDATE complaints
        SET
            status = 'In Progress',
            verification_notes = ?,
            completion_submitted_at = NULL,
            verified_at = NULL,
            verified_by = NULL
        WHERE complaint_id = ?
            AND status = 'Awaiting Verification'
    `;

    db.query(sql, [verificationNotes, validatedId.value], (err, result) => {

        if (err) {
            console.log("Reject Complaint Completion Error:", err);

            return res.status(500).json({
                message: "Failed to send complaint back to technician"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: "Complaint is not awaiting verification"
            });
        }

        const technicianSql = `
            SELECT t.user_id
            FROM complaints c
            JOIN technicians t
                ON c.technician_id = t.technician_id
            WHERE c.complaint_id = ?
        `;

        db.query(technicianSql, [validatedId.value], (technicianErr, technicianResult) => {
            if (technicianErr) {
                console.log("Reject Complaint Technician Lookup Error:", technicianErr);
                return res.status(500).json({
                    message: "Complaint rejected, but technician notification could not be created",
                    error: technicianErr.message
                });
            }

            if (technicianResult.length === 0) {
                return res.status(500).json({
                    message: "Complaint rejected, but notification recipient was not found"
                });
            }

            createUserNotification(
                technicianResult[0].user_id,
                validatedId.value,
                `Complaint #${validatedId.value} requires further work after verification.`,
                "rejection",
                (notificationErr) => {
                    if (notificationErr) {
                        console.log("Create Rejection Notification Error:", notificationErr);
                        return res.status(500).json({
                            message: "Complaint rejected, but technician notification could not be created",
                            error: notificationErr.message
                        });
                    }

                    res.status(200).json({
                        message: "Complaint sent back to technician.",
                        status: "In Progress"
                    });
                }
            );
        });

    });

};

// ==========================
// Update Repair Notes (Technician)
// ==========================
const updateRepairNotes = (req, res) => {

    const userId = req.user?.id;
    const role = req.user?.role;
    const { id } = req.params;
    const validatedId = positiveIntegerId(id, "complaint ID");
    const repairNotes = String(req.body.repair_notes || "").trim();

    if (validatedId.error) {
        return res.status(400).json({ message: validatedId.error });
    }

    if (!userId || role !== "Technician") {
        return res.status(403).json({
            message: "Only technicians can update repair notes"
        });
    }

    if (!repairNotes) {
        return res.status(400).json({
            message: "Repair Notes are required"
        });
    }

    const complaintSql = `
        SELECT c.status
        FROM complaints c
        INNER JOIN technicians t
            ON c.technician_id = t.technician_id
        WHERE c.complaint_id = ?
            AND t.user_id = ?
    `;

    db.query(complaintSql, [validatedId.value, userId], (err, complaintResult) => {

        if (err) {
            console.log("Repair Notes Complaint Lookup Error:", err);

            return res.status(500).json({
                message: "Failed to save repair notes"
            });
        }

        if (complaintResult.length === 0) {
            return res.status(404).json({
                message: "Complaint Not Found or not assigned to you"
            });
        }

        if (!["Assigned", "In Progress"].includes(complaintResult[0].status)) {
            return res.status(400).json({
                message: "Repair notes cannot be updated in the current complaint status"
            });
        }

        const sql = `
            UPDATE complaints c
            INNER JOIN technicians t
                ON c.technician_id = t.technician_id
            SET c.repair_notes = ?
            WHERE c.complaint_id = ?
                AND t.user_id = ?
                AND c.status IN ('Assigned', 'In Progress')
        `;

        db.query(sql, [repairNotes, validatedId.value, userId], (updateErr, result) => {
            if (updateErr) {
                console.log("Update Repair Notes Error:", updateErr);
                return res.status(500).json({ message: "Failed to save repair notes" });
            }

            if (result.affectedRows === 0) {
                return res.status(400).json({
                    message: "Repair notes cannot be updated in the current complaint status"
                });
            }

            res.status(200).json({
                message: "Complaint Updated Successfully",
                repair_notes: repairNotes
            });
        });

    });

};

// ==========================
// Assign Technician
// ==========================
const insertAssignmentNotification = (technicianUserId, complaintId, callback) => {

    const notificationSql = `
        INSERT INTO notifications
        (
            user_id,
            complaint_id,
            message,
            type,
            is_read
        )
        VALUES (?, ?, ?, 'assignment', 0)
    `;

    db.query(
        notificationSql,
        [
            technicianUserId,
            complaintId,
            `Complaint #${complaintId} has been assigned to you.`
        ],
        callback
    );
};

const assignTechnician = (req, res) => {

    const role = req.user?.role;
    const { id } = req.params;
    const { technician_id, priority } = req.body;
    const validatedComplaintId = positiveIntegerId(id, "complaint ID");
    const validatedTechnicianId = positiveIntegerId(technician_id, "technician ID");
    const allowedPriorities = ["Low", "Medium", "High"];

    if (validatedComplaintId.error) {
        return res.status(400).json({ message: validatedComplaintId.error });
    }

    if (role !== "Admin") {
        return res.status(403).json({
            message: "Only administrators can assign technicians"
        });
    }

    if (validatedTechnicianId.error || !allowedPriorities.includes(priority)) {
        return res.status(400).json({
            message: validatedTechnicianId.error || "A valid priority is required"
        });
    }

    const complaintSql = `
        SELECT complaint_id, department_id, status
        FROM complaints
        WHERE complaint_id = ?
    `;

    db.query(complaintSql, [validatedComplaintId.value], (err, complaintResult) => {

        if (err) {
            console.log("Assign Technician Complaint Lookup Error:", err);
            return res.status(500).json({ message: "Database Error" });
        }

        if (complaintResult.length === 0) {
            return res.status(404).json({ message: "Complaint Not Found" });
        }

        const complaint = complaintResult[0];
        if (!positiveIntegerId(complaint.department_id, "department ID").value) {
            return res.status(400).json({ message: "Complaint has an invalid department" });
        }

        if (complaint.status !== "Pending") {
            return res.status(400).json({ message: "Only Pending complaints can be assigned" });
        }

        const technicianSql = `
            SELECT t.technician_id, t.user_id, t.department_id
            FROM technicians t
            INNER JOIN users u ON u.user_id = t.user_id
            WHERE t.technician_id = ?
                AND u.role = 'Technician'
        `;

        db.query(technicianSql, [validatedTechnicianId.value], (technicianErr, technicianResult) => {
            if (technicianErr) {
                console.log("Assign Technician Lookup Error:", technicianErr);
                return res.status(500).json({ message: "Database Error" });
            }

            if (technicianResult.length === 0) {
                return res.status(404).json({ message: "Technician Not Found" });
            }

            if (Number(technicianResult[0].department_id) !== Number(complaint.department_id)) {
                return res.status(400).json({
                    message: "Technician does not belong to this complaint's department"
                });
            }

            db.beginTransaction((transactionErr) => {
                if (transactionErr) {
                    console.log(transactionErr);
                    return res.status(500).json({ message: "Database Error" });
                }

                const updateSql = `
                    UPDATE complaints
                    SET
                        technician_id = ?,
                        priority = ?,
                        status = 'Assigned',
                        assigned_at = CURRENT_TIMESTAMP
                    WHERE complaint_id = ?
                        AND status = 'Pending'
                `;

                db.query(updateSql, [validatedTechnicianId.value, priority, validatedComplaintId.value], (updateErr, updateResult) => {
                    if (updateErr) {
                        return db.rollback(() => {
                            console.log(updateErr);
                            res.status(500).json({ message: "Database Error" });
                        });
                    }

                    if (updateResult.affectedRows === 0) {
                        return db.rollback(() => {
                            res.status(400).json({ message: "Only Pending complaints can be assigned" });
                        });
                    }

                    insertAssignmentNotification(
                        technicianResult[0].user_id,
                        validatedComplaintId.value,
                        (notificationErr) => {
                            if (notificationErr) {
                                return db.rollback(() => {
                                    console.log("Create Assignment Notification Error:", notificationErr);
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

                                res.status(200).json({ message: "Technician Assigned Successfully" });
                            });
                        }
                    );
                });
            });
        });

    });

};

// ==========================
// Reassign Technician
// ==========================
const reassignTechnician = (req, res) => {

    const role = req.user?.role;
    const { id } = req.params;
    const { technician_id } = req.body;
    const validatedComplaintId = positiveIntegerId(id, "complaint ID");
    const validatedTechnicianId = positiveIntegerId(technician_id, "technician ID");

    if (validatedComplaintId.error) {
        return res.status(400).json({ message: validatedComplaintId.error });
    }

    if (role !== "Admin") {
        return res.status(403).json({
            message: "Only administrators can reassign technicians"
        });
    }

    if (validatedTechnicianId.error) {
        return res.status(400).json({
            message: validatedTechnicianId.error
        });
    }

    const complaintSql = `
        SELECT complaint_id, department_id, technician_id, status
        FROM complaints
        WHERE complaint_id = ?
    `;

    db.query(complaintSql, [validatedComplaintId.value], (err, complaintResult) => {
        if (err) {
            console.log("Reassign Technician Complaint Lookup Error:", err);
            return res.status(500).json({ message: "Database Error" });
        }

        if (complaintResult.length === 0) {
            return res.status(404).json({ message: "Complaint Not Found" });
        }

        const complaint = complaintResult[0];
        if (!positiveIntegerId(complaint.department_id, "department ID").value) {
            return res.status(400).json({ message: "Complaint has an invalid department" });
        }

        if (!["Assigned", "In Progress"].includes(complaint.status)) {
            return res.status(400).json({
                message: "Only Assigned or In Progress complaints can be reassigned"
            });
        }

        if (Number(complaint.technician_id) === validatedTechnicianId.value) {
            return res.status(400).json({
                message: "Complaint is already assigned to this technician"
            });
        }

        const technicianSql = `
            SELECT t.technician_id, t.user_id, t.department_id
            FROM technicians t
            INNER JOIN users u ON u.user_id = t.user_id
            WHERE t.technician_id = ?
                AND u.role = 'Technician'
        `;

        db.query(technicianSql, [validatedTechnicianId.value], (technicianErr, technicianResult) => {
            if (technicianErr) {
                console.log("Reassign Technician Validation Error:", technicianErr);
                return res.status(500).json({ message: "Database Error" });
            }

            if (technicianResult.length === 0) {
                return res.status(404).json({ message: "Technician Not Found" });
            }

            if (Number(technicianResult[0].department_id) !== Number(complaint.department_id)) {
                return res.status(400).json({
                    message: "Technician does not belong to this complaint's department"
                });
            }

            db.beginTransaction((transactionErr) => {
                if (transactionErr) {
                    console.log(transactionErr);
                    return res.status(500).json({ message: "Database Error" });
                }

                const updateSql = `
                    UPDATE complaints
                    SET technician_id = ?
                    WHERE complaint_id = ?
                        AND status IN ('Assigned', 'In Progress')
                `;

                db.query(updateSql, [validatedTechnicianId.value, validatedComplaintId.value], (updateErr, updateResult) => {
                    if (updateErr) {
                        return db.rollback(() => {
                            console.log("Reassign Technician Error:", updateErr);
                            res.status(500).json({ message: "Failed to reassign technician" });
                        });
                    }

                    if (updateResult.affectedRows === 0) {
                        return db.rollback(() => {
                            res.status(400).json({
                                message: "Only Assigned or In Progress complaints can be reassigned"
                            });
                        });
                    }

                    insertAssignmentNotification(
                        technicianResult[0].user_id,
                        validatedComplaintId.value,
                        (notificationErr) => {
                            if (notificationErr) {
                                return db.rollback(() => {
                                    console.log("Create Assignment Notification Error:", notificationErr);
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
                                    message: "Technician Reassigned Successfully"
                                });
                            });
                        }
                    );
                });
            });
        });
    });

};

// ==========================
// Delete Complaint
// ==========================
const deleteComplaint = (req, res) => {

    const { id } = req.params;
    const validatedId = positiveIntegerId(id, "complaint ID");

    if (validatedId.error) {
        return res.status(400).json({ message: validatedId.error });
    }

    const sql = `
        DELETE FROM complaints
        WHERE complaint_id = ?
    `;

    db.query(sql, [validatedId.value], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Complaint Not Found"
            });
        }

        res.status(200).json({
            message: "Complaint Deleted Successfully"
        });

    });

};

// ==========================
// Export Controllers
// ==========================
module.exports = {
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
};
