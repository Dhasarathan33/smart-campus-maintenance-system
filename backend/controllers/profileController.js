const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { phone, password: validatePassword } = require("../utils/validation");

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.query(sql, params, (error, result) => {
        if (error) reject(error);
        else resolve(result);
    });
});

const getProfile = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const sql = `
        SELECT
            u.full_name,
            u.college_email,
            u.phone_number,
            u.role,
            COALESCE(ad.department_name, d.department_name) AS department_name
        FROM users u
        LEFT JOIN academic_departments ad
            ON u.department_id = ad.department_id
        LEFT JOIN technicians t
            ON t.user_id = u.user_id
        LEFT JOIN departments d
            ON t.department_id = d.department_id
        WHERE u.user_id = ?
        LIMIT 1
    `;

    try {
        const result = await query(sql, [userId]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Profile Not Found" });
        }

        return res.status(200).json(result[0]);
    } catch (error) {
        console.log("Get Profile Error:", error);
        return res.status(500).json({ message: "Failed to load profile" });
    }
};

const updateProfile = async (req, res) => {
    const userId = req.user?.id;
    const phoneNumber = req.body?.phone_number;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const validatedPhone = phone(phoneNumber);
    if (validatedPhone.error) {
        return res.status(400).json({ message: validatedPhone.error });
    }

    try {
        const result = await query(
            "UPDATE users SET phone_number = ? WHERE user_id = ?",
            [validatedPhone.value, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Profile Not Found" });
        }

        return res.status(200).json({
            message: "Profile Updated Successfully",
            phone_number: validatedPhone.value
        });
    } catch (error) {
        console.log("Update Profile Error:", error);
        return res.status(500).json({ message: "Failed to update profile" });
    }
};

const changePassword = async (req, res) => {
    const userId = req.user?.id;
    const oldPassword = req.body?.old_password;
    const newPassword = req.body?.new_password;
    const confirmPassword = req.body?.confirm_password;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const validatedOldPassword = validatePassword(oldPassword, "Old password");
    const validatedNewPassword = validatePassword(newPassword, "New password");
    const validatedConfirmPassword = validatePassword(confirmPassword, "Confirm password");

    for (const validation of [validatedOldPassword, validatedNewPassword, validatedConfirmPassword]) {
        if (validation.error) {
            return res.status(400).json({ message: validation.error });
        }
    }

    if (validatedNewPassword.value !== validatedConfirmPassword.value) {
        return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    try {
        const result = await query(
            "SELECT password FROM users WHERE user_id = ? LIMIT 1",
            [userId]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Profile Not Found" });
        }

        const oldPasswordMatches = await bcrypt.compare(validatedOldPassword.value, result[0].password);

        if (!oldPasswordMatches) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(validatedNewPassword.value, 10);
        await query(
            "UPDATE users SET password = ? WHERE user_id = ?",
            [hashedPassword, userId]
        );

        return res.status(200).json({ message: "Password Changed Successfully" });
    } catch (error) {
        console.log("Change Password Error:", error);
        return res.status(500).json({ message: "Failed to change password" });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword
};
