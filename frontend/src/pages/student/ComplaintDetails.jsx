import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import api from "../../services/api";
import { getComplaintImageUrl } from "../../services/complaintService";

function StudentComplaintDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const loadComplaint = useCallback(async () => {
        setLoading(true);
        setNotFound(false);

        try {
            const response = await api.get(`/complaints/${id}`);
            setComplaint(response.data);
        } catch (error) {
            console.log(error);

            if (error.response?.status === 404) {
                setNotFound(true);
                setComplaint(null);
            } else {
                setNotFound(true);
                setComplaint(null);
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const initialLoad = setTimeout(() => { void loadComplaint(); }, 0);
        return () => clearTimeout(initialLoad);
    }, [loadComplaint]);

    const getStatusClass = (status) => {
        if (status === "Pending") {
            return "bg-yellow-100 text-yellow-700 border-yellow-200";
        }

        if (status === "Assigned") {
            return "bg-blue-100 text-blue-700 border-blue-200";
        }

        if (status === "In Progress") {
            return "bg-orange-100 text-orange-700 border-orange-200";
        }

        if (status === "Awaiting Verification") {
            return "bg-purple-100 text-purple-700 border-purple-200";
        }

        if (status === "Completed") {
            return "bg-green-100 text-green-700 border-green-200";
        }

        return "bg-slate-100 text-slate-700 border-slate-200";
    };

    const formatDate = (value) => {
        if (!value) {
            return "-";
        }

        return new Date(value).toLocaleString();
    };

    if (loading) {
        return (
            <StudentLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="rounded-3xl bg-white shadow-lg border border-blue-100 px-8 py-10 text-center">
                        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />
                        <p className="mt-4 text-slate-600 font-medium">
                            Loading complaint details...
                        </p>
                    </div>
                </div>
            </StudentLayout>
        );
    }

    if (notFound || !complaint) {
        return (
            <StudentLayout>
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-3xl bg-white shadow-lg border border-blue-100 p-8 text-center">
                        <h1 className="text-3xl font-bold text-slate-800">
                            Complaint not found.
                        </h1>
                        <p className="mt-3 text-slate-500">
                            We could not load this complaint or it does not belong to your account.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/student-my-complaints")}
                            className="mt-6 rounded-xl bg-blue-700 px-6 py-3 text-white hover:bg-blue-800"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout>
            <div className="space-y-6">
                <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white shadow-xl p-6 md:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-blue-100">
                                Complaint Details
                            </p>
                            <h1 className="mt-3 text-3xl md:text-4xl font-bold">
                                Complaint Details
                            </h1>
                            <p className="mt-3 text-blue-50 text-sm md:text-base">
                                Track your maintenance request
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/student-my-complaints")}
                            className="rounded-xl bg-white/15 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/25"
                        >
                            Back
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-3xl bg-white shadow-lg border border-blue-100 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Complaint ID</p>
                                <p className="mt-2 text-lg font-semibold text-slate-800">
                                    {complaint.complaint_id}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Status</p>
                                <div className="mt-2">
                                    <span
                                        className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${getStatusClass(complaint.status)}`}
                                    >
                                        {complaint.status}
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                                <p className="text-sm text-slate-500">Title</p>
                                <p className="mt-2 text-lg font-semibold text-slate-800">
                                    {complaint.title}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                                <p className="text-sm text-slate-500">Description</p>
                                <p className="mt-2 whitespace-pre-line text-slate-700 leading-7">
                                    {complaint.description || "-"}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Maintenance Department</p>
                                <p className="mt-2 font-semibold text-slate-800">
                                    {complaint.department_name || "-"}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Location</p>
                                <p className="mt-2 font-semibold text-slate-800">
                                    {complaint.location || "-"}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Assigned Technician</p>
                                <p className="mt-2 font-semibold text-slate-800">
                                    {complaint.technician_name || "Not Assigned"}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Created Date</p>
                                <p className="mt-2 font-semibold text-slate-800">
                                    {formatDate(complaint.created_at)}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                                <p className="text-sm text-slate-500">Repair Notes</p>
                                <p className="mt-2 whitespace-pre-line text-slate-700 leading-7">
                                    {complaint.repair_notes || "No repair notes yet."}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                                <p className="text-sm text-slate-500">Updated Date</p>
                                <p className="mt-2 font-semibold text-slate-800">
                                    {formatDate(complaint.updated_at)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white shadow-lg border border-blue-100 p-6">
                        <p className="text-lg font-bold text-slate-800 mb-4">
                            Uploaded Image
                        </p>

                        {complaint.image ? (
                            <img
                                src={getComplaintImageUrl(complaint.image)}
                                alt="Complaint"
                                className="w-full rounded-2xl border border-slate-200 object-cover"
                            />
                        ) : (
                            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-500">
                                No image uploaded.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}

export default StudentComplaintDetails;
