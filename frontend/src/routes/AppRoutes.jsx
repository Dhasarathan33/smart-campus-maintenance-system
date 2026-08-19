import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";

import Dashboard from "../pages/admin/Dashboard";
import Complaints from "../pages/admin/Complaints";
import Technicians from "../pages/admin/Technicians";
import AddTechnician from "../pages/admin/AddTechnician";
import EditTechnician from "../pages/admin/EditTechnician";
import AssignTechnician from "../pages/admin/AssignTechnician";
import ReassignTechnician from "../pages/admin/ReassignTechnician";
import AdminComplaintDetails from "../pages/admin/ComplaintDetails";
import Students from "../pages/admin/Students";
import AddStudent from "../pages/admin/AddStudent";
import EditStudent from "../pages/admin/EditStudent";
import Reports from "../pages/admin/Reports";

import TechnicianDashboard from "../pages/technician/Dashboard";
import AssignedComplaints from "../pages/technician/AssignedComplaints";
import ComplaintDetails from "../pages/technician/ComplaintDetails";

import StudentDashboard from "../pages/student/Dashboard";
import CreateComplaint from "../pages/student/CreateComplaint";
import MyComplaints from "../pages/student/MyComplaints";
import StudentComplaintDetails from "../pages/student/ComplaintDetails";
import StudentProfile from "../pages/student/Profile";
import Settings from "../pages/Settings";
import RoleProtectedRoute from "../components/RoleProtectedRoute";

function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Authentication */}
                <Route
                    path="/"
                    element={<Login />}
                />

                {/* ===================== ADMIN ===================== */}

                <Route
                    path="/admin-dashboard"
                    element={<RoleProtectedRoute allowedRoles={["Admin"]}><Dashboard /></RoleProtectedRoute>}
                />

                <Route
                    path="/admin-complaints"
                    element={<RoleProtectedRoute allowedRoles={["Admin"]}><Complaints /></RoleProtectedRoute>}
                />

                <Route
                    path="/admin-technicians"
                    element={<RoleProtectedRoute allowedRoles={["Admin"]}><Technicians /></RoleProtectedRoute>}
                />

                <Route
                    path="/admin-students"
                    element={<RoleProtectedRoute allowedRoles={["Admin"]}><Students /></RoleProtectedRoute>}
                />

                <Route
                    path="/admin-reports"
                    element={<RoleProtectedRoute allowedRoles={["Admin"]}><Reports /></RoleProtectedRoute>}
                />

                <Route
                    path="/admin-add-technician"
                    element={<RoleProtectedRoute allowedRoles={["Admin"]}><AddTechnician /></RoleProtectedRoute>}
                />

                <Route
                    path="/admin-edit-technician/:id"
                    element={<RoleProtectedRoute allowedRoles={["Admin"]}><EditTechnician /></RoleProtectedRoute>}
                />

                <Route
                    path="/admin-add-student"
                    element={<RoleProtectedRoute allowedRoles={["Admin"]}><AddStudent /></RoleProtectedRoute>}
                />

                <Route
                    path="/admin-edit-student/:id"
                    element={<RoleProtectedRoute allowedRoles={["Admin"]}><EditStudent /></RoleProtectedRoute>}
                />

                <Route
                    path="/assign-technician/:id"
                    element={<RoleProtectedRoute allowedRoles={["Admin"]}><AssignTechnician /></RoleProtectedRoute>}
                />

                <Route
                    path="/reassign-technician/:id"
                    element={<RoleProtectedRoute allowedRoles={["Admin"]}><ReassignTechnician /></RoleProtectedRoute>}
                />

                <Route
                    path="/admin-complaint/:id"
                    element={<RoleProtectedRoute allowedRoles={["Admin"]}><AdminComplaintDetails /></RoleProtectedRoute>}
                />

                <Route path="/admin-settings" element={<RoleProtectedRoute allowedRoles={["Admin"]}><Settings /></RoleProtectedRoute>} />

                {/* ===================== TECHNICIAN ===================== */}

                <Route
                    path="/technician-dashboard"
                    element={<RoleProtectedRoute allowedRoles={["Technician"]}><TechnicianDashboard /></RoleProtectedRoute>}
                />

                <Route
                    path="/technician-assigned-complaints"
                    element={<RoleProtectedRoute allowedRoles={["Technician"]}><AssignedComplaints /></RoleProtectedRoute>}
                />

                <Route
                    path="/technician-complaint/:id"
                    element={<RoleProtectedRoute allowedRoles={["Technician"]}><ComplaintDetails /></RoleProtectedRoute>}
                />

                <Route path="/technician-settings" element={<RoleProtectedRoute allowedRoles={["Technician"]}><Settings /></RoleProtectedRoute>} />

                {/* ===================== STUDENT ===================== */}

                <Route
                    path="/student-dashboard"
                    element={<RoleProtectedRoute allowedRoles={["Student"]}><StudentDashboard /></RoleProtectedRoute>}
                />

                <Route
                    path="/student-create-complaint"
                    element={<RoleProtectedRoute allowedRoles={["Student"]}><CreateComplaint /></RoleProtectedRoute>}
                />

                <Route
                    path="/student-my-complaints"
                    element={<RoleProtectedRoute allowedRoles={["Student"]}><MyComplaints /></RoleProtectedRoute>}
                />

                <Route
                    path="/student-complaint/:id"
                    element={<RoleProtectedRoute allowedRoles={["Student"]}><StudentComplaintDetails /></RoleProtectedRoute>}
                />

                <Route
                    path="/student-profile"
                    element={<RoleProtectedRoute allowedRoles={["Student"]}><StudentProfile /></RoleProtectedRoute>}
                />

                <Route path="/student-settings" element={<RoleProtectedRoute allowedRoles={["Student"]}><Settings /></RoleProtectedRoute>} />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;
