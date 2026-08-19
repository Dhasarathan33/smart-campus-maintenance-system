const db = require("../config/db");

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.query(sql, params, (error, result) => {
        if (error) {
            reject(error);
            return;
        }

        resolve(result);
    });
});

const ensureAdmin = (req, res) => {
    if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return false;
    }

    if (req.user.role !== "Admin") {
        res.status(403).json({ message: "Only administrators can view reports" });
        return false;
    }

    return true;
};

const handleError = (res, error, label) => {
    console.error(`${label} Error:`, error);
    res.status(500).json({ message: "Failed to load reports" });
};

const getDashboard = async (req, res) => {
    if (!ensureAdmin(req, res)) return;

    const sql = `
        SELECT
            COUNT(c.complaint_id) AS total_complaints,
            COALESCE(SUM(CASE
                WHEN c.status = 'Pending' THEN 1
                ELSE 0
            END), 0) AS pending,
            COALESCE(SUM(CASE
                WHEN c.status = 'Assigned' THEN 1
                ELSE 0
            END), 0) AS assigned,
            COALESCE(SUM(CASE
                WHEN c.status = 'In Progress' THEN 1
                ELSE 0
            END), 0) AS in_progress,
            COALESCE(SUM(CASE
                WHEN c.status = 'Completed' THEN 1
                ELSE 0
            END), 0) AS completed,
            COALESCE(SUM(CASE
                WHEN c.\`priority\` = 'High' THEN 1
                ELSE 0
            END), 0) AS \`high_priority\`,
            COALESCE(SUM(CASE
                WHEN c.\`priority\` = 'Medium' THEN 1
                ELSE 0
            END), 0) AS \`medium_priority\`,
            COALESCE(SUM(CASE
                WHEN c.\`priority\` = 'Low' THEN 1
                ELSE 0
            END), 0) AS \`low_priority\`,
            COALESCE((
                SELECT COUNT(*)
                FROM users
                WHERE role = 'Student'
            ), 0) AS total_students,
            COALESCE((
                SELECT COUNT(*)
                FROM users
                WHERE role = 'Technician'
            ), 0) AS total_technicians
        FROM complaints c
    `;

    try {
        const results = await query(sql);
        res.status(200).json(results[0] || {});
    } catch (error) {
        handleError(res, error, "Get Dashboard Reports");
    }
};

const getStatusReport = async (req, res) => {
    if (!ensureAdmin(req, res)) return;

    const sql = `
        SELECT
            c.status,
            COUNT(c.complaint_id) AS complaint_count
        FROM complaints c
        GROUP BY c.status
        ORDER BY complaint_count DESC, c.status ASC
    `;

    try {
        res.status(200).json(await query(sql));
    } catch (error) {
        handleError(res, error, "Get Status Reports");
    }
};

const getPriorityReport = async (req, res) => {
    if (!ensureAdmin(req, res)) return;

    const sql = `
        SELECT
            priorities.priority,
            COUNT(c.complaint_id) AS complaint_count
        FROM (
            SELECT 'High' AS priority
            UNION ALL SELECT 'Medium'
            UNION ALL SELECT 'Low'
        ) AS priorities
        LEFT JOIN complaints c
            ON c.priority = priorities.priority
        GROUP BY priorities.priority
        ORDER BY CASE priorities.priority
            WHEN 'High' THEN 1
            WHEN 'Medium' THEN 2
            WHEN 'Low' THEN 3
        END
    `;

    try {
        res.status(200).json(await query(sql));
    } catch (error) {
        handleError(res, error, "Get Priority Reports");
    }
};

const getDepartmentReport = async (req, res) => {
    if (!ensureAdmin(req, res)) return;

    const sql = `
        SELECT
            d.department_name,
            COUNT(c.complaint_id) AS complaint_count
        FROM departments d
        LEFT JOIN complaints c
            ON c.department_id = d.department_id
        GROUP BY d.department_id, d.department_name
        ORDER BY complaint_count DESC, d.department_name ASC
    `;

    try {
        res.status(200).json(await query(sql));
    } catch (error) {
        handleError(res, error, "Get Department Reports");
    }
};

const getRecentComplaints = async (req, res) => {
    if (!ensureAdmin(req, res)) return;

    const sql = `
        SELECT
            c.complaint_id,
            u.full_name AS student_name,
            d.department_name,
            COALESCE(tu.full_name, 'Unassigned') AS technician_name,
            c.status,
            c.priority,
            c.created_at
        FROM complaints c
        INNER JOIN users u
            ON u.user_id = c.user_id
        INNER JOIN departments d
            ON d.department_id = c.department_id
        LEFT JOIN technicians t
            ON t.technician_id = c.technician_id
        LEFT JOIN users tu
            ON tu.user_id = t.user_id
        ORDER BY c.created_at DESC
        LIMIT 10
    `;

    try {
        res.status(200).json(await query(sql));
    } catch (error) {
        handleError(res, error, "Get Recent Complaints");
    }
};

module.exports = {
    getDashboard,
    getStatusReport,
    getPriorityReport,
    getDepartmentReport,
    getRecentComplaints
};
