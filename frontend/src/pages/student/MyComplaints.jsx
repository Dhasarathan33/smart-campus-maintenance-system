import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import { getMyComplaints } from "../../services/complaintService";

function MyComplaints() {
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadComplaints();
    }, []);

    async function loadComplaints() {
        setLoading(true);
        setError("");

        try {
            const data = await getMyComplaints();
            setComplaints(data);
        } catch (requestError) {
            console.log(requestError);
            setError("Unable to load your complaints right now.");
            setComplaints([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredComplaints = complaints.filter((complaint) => {
        const matchesSearch = complaint.title
            ?.toLowerCase()
            .includes(search.toLowerCase());
        const matchesStatus = status === "All" || complaint.status === status;

        return matchesSearch && matchesStatus;
    });

    const getStatusClass = (complaintStatus) => {
        if (complaintStatus === "Pending") {
            return "bg-yellow-100 text-yellow-700 border-yellow-200";
        }

        if (complaintStatus === "Assigned") {
            return "bg-blue-100 text-blue-700 border-blue-200";
        }

        if (complaintStatus === "In Progress") {
            return "bg-orange-100 text-orange-700 border-orange-200";
        }

        if (complaintStatus === "Awaiting Verification") {
            return "bg-purple-100 text-purple-700 border-purple-200";
        }

        if (complaintStatus === "Completed") {
            return "bg-green-100 text-green-700 border-green-200";
        }

        return "bg-slate-100 text-slate-700 border-slate-200";
    };

    const handleView = (id) => {
        navigate(`/student-complaint/${id}`);
    };

    return (
        <StudentLayout>
            <div className="space-y-6">
                <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white shadow-xl p-6 md:p-8">
                    <div className="max-w-3xl">
                        <p className="text-sm uppercase tracking-[0.3em] text-blue-100">
                            Student Complaints
                        </p>
                        <h1 className="mt-3 text-3xl md:text-4xl font-bold">
                            My Complaints
                        </h1>
                        <p className="mt-3 text-blue-50 text-sm md:text-base">
                            Track the complaints you raised, filter by status, and jump back into any item quickly.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-white shadow-sm border border-blue-100 p-5">
                        <p className="text-sm text-slate-500">Total Complaints</p>
                        <p className="mt-2 text-3xl font-bold text-blue-700">{complaints.length}</p>
                    </div>
                    <div className="rounded-2xl bg-white shadow-sm border border-blue-100 p-5">
                        <p className="text-sm text-slate-500">Visible Results</p>
                        <p className="mt-2 text-3xl font-bold text-cyan-700">{filteredComplaints.length}</p>
                    </div>
                    <div className="rounded-2xl bg-white shadow-sm border border-blue-100 p-5">
                        <p className="text-sm text-slate-500">Active Filter</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-800">{status}</p>
                    </div>
                </div>

                <div className="rounded-3xl bg-white shadow-lg border border-blue-100 p-5 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Search by Title
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Type a complaint title..."
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Status Filter
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white"
                            >
                                <option value="All">All</option>
                                <option value="Pending">Pending</option>
                                <option value="Assigned">Assigned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Awaiting Verification">Awaiting Verification</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-white shadow-lg border border-blue-100 overflow-hidden">
                    {loading ? (
                        <div className="p-10 text-center text-slate-500">
                            Loading your complaints...
                        </div>
                    ) : error ? (
                        <div className="p-10 text-center">
                            <p className="text-slate-600">{error}</p>
                            <button
                                type="button"
                                onClick={loadComplaints}
                                className="mt-4 rounded-xl bg-blue-700 px-5 py-3 text-white hover:bg-blue-800"
                            >
                                Retry
                            </button>
                        </div>
                    ) : filteredComplaints.length === 0 ? (
                        <div className="p-10 text-center text-slate-500">
                            No complaints match your current search or filter.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[980px]">
                                <thead className="bg-blue-700 text-white">
                                    <tr className="text-sm uppercase tracking-wide">
                                        <th className="p-4 text-center w-32">Complaint ID</th>
                                        <th className="px-4 py-4 text-left">Title</th>
                                        <th className="p-4 text-center w-48">Department</th>
                                        <th className="px-4 py-4 text-left">Location</th>
                                        <th className="p-4 text-center w-40">Status</th>
                                        <th className="p-4 text-center w-40">Created Date</th>
                                        <th className="p-4 text-center w-32">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredComplaints.map((complaint) => (
                                        <tr
                                            key={complaint.complaint_id}
                                            className="border-b last:border-b-0 hover:bg-blue-50/60 transition-colors"
                                        >
                                            <td className="px-4 py-4 text-center whitespace-nowrap text-slate-700">
                                                {complaint.complaint_id}
                                            </td>
                                            <td className="px-4 py-4 text-slate-800 font-medium">
                                                {complaint.title}
                                            </td>
                                            <td className="px-4 py-4 text-center text-slate-700">
                                                {complaint.department_name}
                                            </td>
                                            <td className="px-4 py-4 text-slate-700">
                                                {complaint.location}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${getStatusClass(complaint.status)}`}
                                                >
                                                    {complaint.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center whitespace-nowrap text-slate-700">
                                                {new Date(complaint.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleView(complaint.complaint_id)}
                                                    className="rounded-xl bg-blue-700 px-4 py-2 text-white shadow-sm transition hover:bg-blue-800"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}

export default MyComplaints;
