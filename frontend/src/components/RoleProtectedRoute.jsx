import { Navigate, useLocation } from "react-router-dom";

const roleHome = {
    Admin: "/admin-dashboard",
    Technician: "/technician-dashboard",
    Student: "/student-dashboard"
};

function RoleProtectedRoute({ allowedRoles, children }) {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to={roleHome[role] || "/"} replace />;
    }

    return children;
}

export default RoleProtectedRoute;
