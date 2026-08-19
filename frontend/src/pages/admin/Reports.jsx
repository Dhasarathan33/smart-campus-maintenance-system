import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    ArcElement,
    Tooltip
} from "chart.js";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const statusColors = {
    Pending: "#f59e0b",
    Assigned: "#2563eb",
    "In Progress": "#f97316",
    "Awaiting Verification": "#9333ea",
    Completed: "#16a34a"
};
const priorityColors = { High: "#dc2626", Medium: "#f59e0b", Low: "#16a34a" };

function Reports() {
    const [dashboard, setDashboard] = useState(null);
    const [statuses, setStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadReports();
    }, []);

    async function loadReports() {
        setLoading(true);
        setError("");

        try {
            const [dashboardResponse, statusResponse, priorityResponse, departmentResponse, recentResponse] = await Promise.all([
                api.get("/reports/dashboard"),
                api.get("/reports/status"),
                api.get("/reports/priority"),
                api.get("/reports/departments"),
                api.get("/reports/recent")
            ]);

            setDashboard(dashboardResponse.data);
            setStatuses(statusResponse.data);
            setPriorities(priorityResponse.data);
            setDepartments(departmentResponse.data);
            setRecentComplaints(recentResponse.data);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to load reports right now.");
        } finally {
            setLoading(false);
        }
    };

    const cards = dashboard ? [
        { label: "Total Complaints", value: dashboard.total_complaints, color: "text-blue-700" },
        { label: "Pending", value: dashboard.pending, color: "text-amber-600" },
        { label: "Assigned", value: dashboard.assigned, color: "text-indigo-600" },
        { label: "In Progress", value: dashboard.in_progress, color: "text-orange-600" },
        { label: "Completed", value: dashboard.completed, color: "text-green-600" },
        { label: "Total Students", value: dashboard.total_students, color: "text-cyan-700" },
        { label: "Total Technicians", value: dashboard.total_technicians, color: "text-violet-700" }
    ] : [];

    const departmentChart = {
        labels: departments.map((department) => department.department_name),
        datasets: [{
            label: "Complaints",
            data: departments.map((department) => department.complaint_count),
            backgroundColor: "rgba(37, 99, 235, 0.8)",
            borderRadius: 8,
            maxBarThickness: 46
        }]
    };

    const statusChart = {
        labels: statuses.map((item) => item.status),
        datasets: [{
            data: statuses.map((item) => item.complaint_count),
            backgroundColor: statuses.map((item) => statusColors[item.status] || "#64748b"),
            borderColor: "#ffffff",
            borderWidth: 3
        }]
    };

    const priorityChart = {
        labels: priorities.map((item) => item.priority),
        datasets: [{
            data: priorities.map((item) => item.complaint_count),
            backgroundColor: priorities.map((item) => priorityColors[item.priority] || "#64748b"),
            borderColor: "#ffffff",
            borderWidth: 3
        }]
    };

    return (
        <AdminLayout>
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-6 text-white shadow-xl md:p-8">
                    <p className="text-sm uppercase tracking-[0.3em] text-blue-100">Admin Analytics</p>
                    <h1 className="mt-3 text-3xl font-bold md:text-4xl">Reports</h1>
                    <p className="mt-3 text-sm text-blue-50 md:text-base">Monitor complaint activity and campus maintenance performance.</p>
                </div>

                {loading ? (
                    <div className="rounded-3xl bg-white p-12 text-center text-slate-500 shadow-lg">Loading reports...</div>
                ) : error ? (
                    <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
                        <p className="text-red-600">{error}</p>
                        <button type="button" onClick={loadReports} className="mt-4 rounded-xl bg-blue-700 px-5 py-3 text-white hover:bg-blue-800">Retry</button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                            {cards.map((card) => (
                                <div key={card.label} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                                    <p className="text-sm text-slate-500">{card.label}</p>
                                    <p className={`mt-2 text-3xl font-bold ${card.color}`}>{card.value ?? 0}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                            <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-lg md:p-6 xl:col-span-3">
                                <h2 className="text-xl font-bold text-slate-800">Complaints by Department</h2>
                                <div className="mt-6 h-80">
                                    <Bar data={departmentChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }} />
                                </div>
                            </section>

                            <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-lg md:p-6 xl:col-span-2">
                                <h2 className="text-xl font-bold text-slate-800">Complaints by Status</h2>
                                <div className="mx-auto mt-6 h-80 max-w-sm">
                                    <Pie data={statusChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }} />
                                </div>
                            </section>

                            <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-lg md:p-6 xl:col-span-2">
                                <h2 className="text-xl font-bold text-slate-800">Complaints by Priority</h2>
                                <div className="mx-auto mt-6 h-80 max-w-sm">
                                    <Pie data={priorityChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }} />
                                </div>
                            </section>
                        </div>

                        <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg">
                            <div className="p-5 md:p-6">
                                <h2 className="text-xl font-bold text-slate-800">Recent Complaints</h2>
                                <p className="mt-1 text-sm text-slate-500">The latest maintenance requests submitted on campus.</p>
                            </div>
                            {recentComplaints.length === 0 ? (
                                <div className="border-t p-10 text-center text-slate-500">No complaints found.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[900px]">
                                        <thead className="bg-blue-700 text-left text-sm uppercase tracking-wide text-white">
                                            <tr>
                                                <th className="px-5 py-4">Complaint ID</th>
                                                <th className="px-5 py-4">Student</th>
                                                <th className="px-5 py-4">Department</th>
                                                <th className="px-5 py-4">Technician</th>
                                                <th className="px-5 py-4">Status</th>
                                                <th className="px-5 py-4">Priority</th>
                                                <th className="px-5 py-4">Created Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentComplaints.map((complaint) => (
                                                <tr key={complaint.complaint_id} className="border-b last:border-b-0 hover:bg-blue-50/60">
                                                    <td className="px-5 py-4 font-medium text-slate-700">#{complaint.complaint_id}</td>
                                                    <td className="px-5 py-4 text-slate-700">{complaint.student_name}</td>
                                                    <td className="px-5 py-4 text-slate-700">{complaint.department_name}</td>
                                                    <td className="px-5 py-4 text-slate-700">{complaint.technician_name}</td>
                                                    <td className="px-5 py-4"><StatusBadge status={complaint.status} /></td>
                                                    <td className="px-5 py-4"><PriorityBadge priority={complaint.priority} /></td>
                                                    <td className="whitespace-nowrap px-5 py-4 text-slate-700">{new Date(complaint.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}

function StatusBadge({ status }) {
    const classes = {
        Pending: "bg-amber-100 text-amber-700 border-amber-200",
        Assigned: "bg-blue-100 text-blue-700 border-blue-200",
        "In Progress": "bg-orange-100 text-orange-700 border-orange-200",
        "Awaiting Verification": "bg-purple-100 text-purple-700 border-purple-200",
        Completed: "bg-green-100 text-green-700 border-green-200"
    };

    return <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${classes[status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>{status}</span>;
}

function PriorityBadge({ priority }) {
    const classes = { High: "bg-red-100 text-red-700 border-red-200", Medium: "bg-amber-100 text-amber-700 border-amber-200", Low: "bg-green-100 text-green-700 border-green-200" };
    return <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${classes[priority] || "bg-slate-100 text-slate-700 border-slate-200"}`}>{priority || "Low"}</span>;
}

export default Reports;
