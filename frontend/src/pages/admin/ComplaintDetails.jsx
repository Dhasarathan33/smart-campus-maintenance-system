import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import {
    getComplaintById,
    approveComplaintCompletion,
    rejectComplaintCompletion,
    getComplaintImageUrl
} from "../../services/complaintService";

function ComplaintDetails() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [error, setError] = useState("");
    const [verificationNotes, setVerificationNotes] = useState("");
    const [verificationBusy, setVerificationBusy] = useState(false);
    const [actionMessage, setActionMessage] = useState("");

    useEffect(() => {
        async function loadComplaint() {
            try {
                const data = await getComplaintById(id);
                setComplaint(data);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to load complaint details.");
            }
        };

        loadComplaint();
    }, [id]);

    if (error) {
        return (
            <AdminLayout>
                <div className="rounded-xl bg-white p-8 text-center shadow-md">
                    <p className="text-red-600 font-semibold">{error}</p>
                    <button
                        type="button"
                        onClick={() => navigate("/admin-complaints")}
                        className="mt-6 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
                    >
                        Back to Complaints
                    </button>
                </div>
            </AdminLayout>
        );
    }

    if (!complaint) {
        return (
            <AdminLayout>
                <div className="mt-20 text-center text-2xl font-semibold">
                    Loading complaint details...
                </div>
            </AdminLayout>
        );
    }

    const approveCompletion = async () => {
        setVerificationBusy(true);
        setError("");
        setActionMessage("");

        try {
            await approveComplaintCompletion(id);
            const now = new Date().toISOString();
            setComplaint((current) => ({
                ...current,
                status: "Completed",
                verified_at: now,
                completed_at: now
            }));
            setActionMessage("Complaint marked as completed.");
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to approve complaint completion.");
        } finally {
            setVerificationBusy(false);
        }
    };

    const rejectCompletion = async () => {
        const reason = verificationNotes.trim();

        if (!reason) {
            setError("A verification reason is required.");
            return;
        }

        setVerificationBusy(true);
        setError("");
        setActionMessage("");

        try {
            await rejectComplaintCompletion(id, reason);
            setComplaint((current) => ({
                ...current,
                status: "In Progress",
                verification_notes: reason,
                completion_submitted_at: null,
                verified_at: null,
                verified_by: null
            }));
            setVerificationNotes("");
            setActionMessage("Complaint sent back to technician.");
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to send the complaint back to the technician.");
        } finally {
            setVerificationBusy(false);
        }
    };

    const statusClass = {
        Pending: "bg-yellow-100 text-yellow-700",
        Assigned: "bg-blue-100 text-blue-700",
        "In Progress": "bg-orange-100 text-orange-700",
        "Awaiting Verification": "bg-purple-100 text-purple-700",
        Completed: "bg-green-100 text-green-700"
    };

    const priorityClass = {
        Low: "bg-green-100 text-green-700",
        Medium: "bg-amber-100 text-amber-700",
        High: "bg-red-100 text-red-700"
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "Pending";

        return new Date(timestamp).toLocaleString();
    };

    const timeline = [
        {
            label: "Complaint Created",
            timestamp: complaint.created_at
        },
        {
            label: "Technician Assigned",
            timestamp: complaint.assigned_at
        },
        {
            label: "Work Started",
            timestamp: complaint.started_at
        }
    ];

    if (complaint.verification_notes) {
        timeline.push({
            label: "Sent Back to Technician",
            timestamp: null,
            note: complaint.verification_notes
        });
    }

    if (complaint.completion_submitted_at || (complaint.status === "In Progress" && complaint.verification_notes)) {
        timeline.push({
            label: "Awaiting Verification",
            timestamp: complaint.completion_submitted_at
        });
    }

    if (complaint.verified_at) {
        timeline.push({
            label: "Verification Approved",
            timestamp: complaint.verified_at
        });
    }

    timeline.push({
        label: "Completed",
        timestamp: complaint.completed_at
    });

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                            Complaint Details
                        </p>
                        <h1 className="mt-1 text-3xl font-bold text-gray-800">
                            Complaint #{complaint.complaint_id}
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/admin-complaints")}
                        className="rounded-lg bg-gray-200 px-5 py-3 font-semibold text-gray-800 hover:bg-gray-300"
                    >
                        Back to Complaints
                    </button>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                    <section className="rounded-2xl bg-white p-6 shadow-md lg:col-span-2">
                        <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Complaint Title</p>
                                <h2 className="mt-1 text-2xl font-bold text-gray-800">
                                    {complaint.title}
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${priorityClass[complaint.priority] || "bg-gray-100 text-gray-700"}`}>
                                    {complaint.priority || "Low"}
                                </span>
                                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClass[complaint.status] || "bg-gray-100 text-gray-700"}`}>
                                    {complaint.status}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            <DetailItem label="Student Name" value={complaint.full_name} />
                            <DetailItem label="Department" value={complaint.department_name} />
                            <DetailItem label="Technician Name" value={complaint.technician_name || "Not Assigned"} />
                            <DetailItem label="Location" value={complaint.location} />
                        </div>

                        <div className="mt-6">
                            <p className="text-sm font-semibold text-gray-500">Description</p>
                            <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700">
                                {complaint.description}
                            </p>
                        </div>

                        {complaint.image && (
                            <div className="mt-6">
                                <p className="text-sm font-semibold text-gray-500">Uploaded Image</p>
                                <img
                                    src={getComplaintImageUrl(complaint.image)}
                                    alt="Complaint"
                                    className="mt-3 max-h-96 rounded-xl border object-contain"
                                />
                            </div>
                        )}
                    </section>

                    <section className="rounded-2xl bg-white p-6 shadow-md">
                        <h2 className="text-xl font-bold text-gray-800">Complaint Timeline</h2>

                        <div className="mt-6 space-y-6">
                            {timeline.map((step) => (
                                <div key={step.label} className="flex gap-3">
                                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${step.timestamp ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                                        {step.timestamp ? "✓" : "○"}
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${step.timestamp ? "text-gray-800" : "text-gray-400"}`}>
                                            {step.label}
                                        </p>
                                        <p className={`mt-1 text-sm ${step.timestamp ? "text-gray-500" : "text-gray-400"}`}>
                                            {step.note || formatTimestamp(step.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 border-t pt-6">
                            {actionMessage && (
                                <p className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                                    {actionMessage}
                                </p>
                            )}

                            {complaint.status === "Awaiting Verification" && (
                                <div className="mb-6 rounded-2xl border border-purple-200 bg-purple-50 p-4">
                                    <h3 className="text-lg font-bold text-purple-900">Completion Verification</h3>
                                    <div className="mt-4 space-y-3 text-sm text-purple-900">
                                        <p><span className="font-semibold">Technician:</span> {complaint.technician_name || "Not available"}</p>
                                        <div>
                                            <p className="font-semibold">Repair Notes:</p>
                                            <p className="mt-1 whitespace-pre-wrap rounded-lg bg-white/70 p-3 text-gray-700">{complaint.repair_notes || "Not available"}</p>
                                        </div>
                                        <p><span className="font-semibold">Completion Submitted:</span> {formatTimestamp(complaint.completion_submitted_at)}</p>
                                    </div>

                                    <textarea
                                        value={verificationNotes}
                                        onChange={(event) => setVerificationNotes(event.target.value)}
                                        rows="3"
                                        placeholder="Reason required only when sending back"
                                        className="mt-4 w-full resize-none rounded-xl border border-purple-200 bg-white px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                                    />

                                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={approveCompletion}
                                            disabled={verificationBusy}
                                            className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Approve Completion
                                        </button>
                                        <button
                                            type="button"
                                            onClick={rejectCompletion}
                                            disabled={verificationBusy}
                                            className="flex-1 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Reject / Send Back
                                        </button>
                                    </div>
                                </div>
                            )}

                            {complaint.status === "Pending" && (
                                <button
                                    type="button"
                                    onClick={() => navigate(`/assign-technician/${complaint.complaint_id}`)}
                                    className="w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
                                >
                                    Assign Technician
                                </button>
                            )}

                            {["Assigned", "In Progress"].includes(complaint.status) && (
                                <button
                                    type="button"
                                    onClick={() => navigate(`/reassign-technician/${complaint.complaint_id}`)}
                                    className="w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
                                >
                                    Reassign Technician
                                </button>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}

function DetailItem({ label, value }) {
    return (
        <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-500">{label}</p>
            <p className="mt-1 font-medium text-gray-800">{value || "Not available"}</p>
        </div>
    );
}

export default ComplaintDetails;
