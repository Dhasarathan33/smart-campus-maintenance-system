import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ComplaintTable from "../../components/ComplaintTable";
import {
    getAllComplaints,
    deleteComplaint
} from "../../services/complaintService";

function Dashboard() {

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getAllComplaints();
            setComplaints(data);
        } catch (error) {
            console.error(error);
            setError("Unable to load complaints right now.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const initialLoad = setTimeout(() => { void fetchComplaints(); }, 0);
        return () => clearTimeout(initialLoad);
    }, [fetchComplaints]);

    // ==========================
    // Delete Complaint
    // ==========================
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this complaint?"
        );

        if (!confirmDelete) return;

        try {

            await deleteComplaint(id);

            alert("Complaint Deleted Successfully");

            fetchComplaints();

        } catch (error) {
            console.error(error);
        }

    };

    const totalComplaints = complaints.length;

    const pendingComplaints = complaints.filter(
        (c) => c.status === "Pending"
    ).length;

    const assignedComplaints = complaints.filter(
        (c) => c.status === "Assigned"
    ).length;

    const completedComplaints = complaints.filter(
        (c) => c.status === "Completed"
    ).length;

    const awaitingVerificationComplaints = complaints.filter(
        (c) => c.status === "Awaiting Verification"
    ).length;

    const highPriorityComplaints = complaints.filter((c) => c.priority === "High").length;
    const mediumPriorityComplaints = complaints.filter((c) => c.priority === "Medium").length;
    const lowPriorityComplaints = complaints.filter((c) => c.priority === "Low").length;

    return (

        <AdminLayout>

            <h1 className="text-3xl font-bold text-gray-800">
                Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
                Welcome to Smart Campus Maintenance System
            </p>

            {/* Dashboard Cards */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-8 gap-6 mt-8">

                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="h-14 text-gray-500">
                        Total Complaints
                    </h2>

                    <p className="text-4xl font-bold text-blue-700 mt-3">
                        {totalComplaints}
                    </p>
                </div>

                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="h-14 text-gray-500">High Priority</h2>
                    <p className="text-4xl font-bold text-red-600 mt-3">{highPriorityComplaints}</p>
                </div>

                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="h-14 text-gray-500">Medium Priority</h2>
                    <p className="text-4xl font-bold text-amber-600 mt-3">{mediumPriorityComplaints}</p>
                </div>

                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="h-14 text-gray-500">Low Priority</h2>
                    <p className="text-4xl font-bold text-green-600 mt-3">{lowPriorityComplaints}</p>
                </div>

                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="h-14 text-gray-500">
                        Pending
                    </h2>

                    <p className="text-4xl font-bold text-yellow-500 mt-3">
                        {pendingComplaints}
                    </p>
                </div>

                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="h-14 text-gray-500">
                        Assigned
                    </h2>

                    <p className="text-4xl font-bold text-indigo-600 mt-3">
                        {assignedComplaints}
                    </p>
                </div>

                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="h-14 text-gray-500">
                        Completed
                    </h2>

                    <p className="text-4xl font-bold text-green-600 mt-3">
                        {completedComplaints}
                    </p>
                </div>

                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="h-14 text-gray-500">
                        Awaiting Verification
                    </h2>

                    <p className="text-4xl font-bold text-purple-600 mt-3">
                        {awaitingVerificationComplaints}
                    </p>
                </div>

            </div>

            {/* Complaint Table */}

            <ComplaintTable
                complaints={complaints}
                onDelete={handleDelete}
                loading={loading}
                error={error}
                onRetry={fetchComplaints}
            />

        </AdminLayout>

    );

}

export default Dashboard;
