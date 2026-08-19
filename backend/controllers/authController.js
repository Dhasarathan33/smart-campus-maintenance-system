const db = require("../config/db");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { email, password } = require("../utils/validation");

// Login Controller
const login = (req, res) => {

    const { college_email, password: rawPassword } = req.body || {};
    const validatedEmail = email(college_email, "Email");
    const validatedPassword = password(rawPassword);

    if (validatedEmail.error) {
        return res.status(400).json({
            message: validatedEmail.error
        });
    }

    if (validatedPassword.error) {
        return res.status(400).json({ message: validatedPassword.error });
    }

    const sql = "SELECT * FROM users WHERE college_email = ?";

    db.query(sql, [validatedEmail.value], async (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(validatedPassword.value, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                role: user.role
            }
        });

    });

};

module.exports = {
    login
};
