const requireAdmin = (req, res, next) => {
    if (!req.user?.id) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    if (req.user.role !== "Admin") {
        return res.status(403).json({
            message: "Only administrators can access this resource"
        });
    }

    next();
};

module.exports = requireAdmin;
