import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TechnicianLayout from "../../layouts/TechnicianLayout";
import api from "../../services/api";
import { getComplaintImageUrl } from "../../services/complaintService";

function ComplaintDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [status, setStatus] = useState("");
    const [repairNotes, setRepairNotes] = useState("");
    const [loading, setLoading] = useState(true);
    const [savingStatus, setSavingStatus] = useState(false);
    const [savingNotes, setSavingNotes] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");

    useEffect(() => {
        if (!toast) return undefined;
        const timer = setTimeout(() => setToast(""), 3000);
        return () => clearTimeout(timer);
    }, [toast]);

    const loadComplaint = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get(`/complaints/${id}`);
            setComplaint(response.data);
            setStatus(response.data.status || "Assigned");
            setRepairNotes(response.data.repair_notes || "");
        } catch (requestError) {
            if (requestError.response?.status === 404) {
                navigate("/technician-assigned-complaints");
                return;
            }
            setError(requestError.response?.data?.message || "Failed to load complaint details.");
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    const showSuccess = () => {
        setError("");
        setToast("Complaint Updated Successfully");
    };

    const verificationRequired = ["Medium", "High"].includes(complaint?.priority);
    const statusOptions = complaint?.status === "Assigned"
        ? ["Assigned", "In Progress"]
        : complaint?.status === "In Progress"
            ? verificationRequired
                ? ["In Progress"]
                : ["In Progress", "Completed"]
            : [complaint?.status || "Assigned"];

    const updateStatus = async (nextStatus = status) => {
        if (nextStatus === "Completed" && !repairNotes.trim()) {
            setError("Repair Notes are required before marking the complaint Completed.");
            return;
        }

        setSavingStatus(true);
        setError("");

        try {
            await api.put(`/complaints/${id}/status`, {
                status: nextStatus,
                repair_notes: repairNotes.trim()
            });
            setComplaint((current) => ({
                ...current,
                status: nextStatus,
                started_at: nextStatus === "In Progress" && !current.started_at
                    ? new Date().toISOString()
                    : current.started_at,
                completed_at: nextStatus === "Completed"
                    ? new Date().toISOString()
                    : current.completed_at,
                repair_notes: repairNotes.trim() || current.repair_notes
            }));
            setStatus(nextStatus);
            showSuccess();
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to update complaint status.");
        } finally {
            setSavingStatus(false);
        }
    };

    const submitForVerification = async () => {
        if (!repairNotes.trim()) {
            setError("Repair Notes are required before submitting for verification.");
            return;
        }

        setSavingStatus(true);
        setError("");

        try {
            await api.put(`/complaints/${id}/status`, {
                status: "Awaiting Verification",
                repair_notes: repairNotes.trim()
            });

            setComplaint((current) => ({
                ...current,
                status: "Awaiting Verification",
                repair_notes: repairNotes.trim(),
                completion_submitted_at: new Date().toISOString()
            }));
            setStatus("Awaiting Verification");
            showSuccess();
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to submit the complaint for verification.");
        } finally {
            setSavingStatus(false);
        }
    };

    const saveRepairNotes = async () => {
        if (!repairNotes.trim()) {
            setError("Repair Notes are required.");
            return;
        }

        setSavingNotes(true);
        setError("");

        try {
            const response = await api.put(`/complaints/${id}/repair-notes`, {
                repair_notes: repairNotes.trim()
            });
            setRepairNotes(response.data.repair_notes || repairNotes.trim());
            setComplaint((current) => ({ ...current, repair_notes: response.data.repair_notes || repairNotes.trim() }));
            showSuccess();
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to save repair notes.");
        } finally {
            setSavingNotes(false);
        }
    };

    const getStatusClass = (currentStatus) => {
        if (currentStatus === "Assigned") return "bg-blue-100 text-blue-700 border-blue-200";
        if (currentStatus === "In Progress") return "bg-amber-100 text-amber-700 border-amber-200";
        if (currentStatus === "Awaiting Verification") return "bg-purple-100 text-purple-700 border-purple-200";
        if (currentStatus === "Completed") return "bg-green-100 text-green-700 border-green-200";
        return "bg-slate-100 text-slate-700 border-slate-200";
    };

    const formattedDate = (date) => date ? new Date(date).toLocaleString() : "Not available";

    useEffect(() => {
        const initialLoad = setTimeout(() => { void loadComplaint(); }, 0);
        return () => clearTimeout(initialLoad);
    }, [loadComplaint]);

    if (loading) {
        return <TechnicianLayout><div className="py-20 text-center text-xl font-semibold text-slate-600">Loading complaint details...</div></TechnicianLayout>;
    }

    if (!complaint) {
        return <TechnicianLayout><div className="py-20 text-center text-xl font-semibold text-slate-600">{error || "Complaint Not Found"}</div></TechnicianLayout>;
    }

    return (
        <TechnicianLayout>
            <div className="mx-auto max-w-6xl space-y-6">
                {toast && (
                    <div className="fixed right-6 top-6 z-50 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white shadow-lg" role="status">
                        {toast}
                    </div>
                )}

                <div className="flex flex-wrap items-start justify-between gap-4 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-6 text-white shadow-xl md:p-8">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-blue-100">Technician Workspace</p>
                        <h1 className="mt-3 text-3xl font-bold md:text-4xl">Complaint Details</h1>
                        <p className="mt-3 text-sm text-blue-50 md:text-base">Review the issue and manage its repair progress.</p>
                    </div>
                    <button type="button" onClick={() => navigate("/technician-assigned-complaints")} className="rounded-xl bg-white/15 px-5 py-3 font-semibold text-white hover:bg-white/25">
                        Back to Complaints
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg xl:col-span-2 md:p-8">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Complaint #{complaint.complaint_id}</p>
                                <h2 className="mt-1 text-2xl font-bold text-slate-800">{complaint.title}</h2>
                            </div>
                            <span className={`rounded-full border px-4 py-2 text-sm font-semibold ${getStatusClass(complaint.status)}`}>{complaint.status}</span>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <Info label="Complaint ID" value={complaint.complaint_id} />
                            <Info label="Student Name" value={complaint.student_name || "Not available"} />
                            <Info label="Department" value={complaint.department_name} />
                            <Info label="Priority" value={complaint.priority || "Low"} />
                            <Info label="Location" value={complaint.location} />
                            <Info label="Created Date" value={formattedDate(complaint.created_at)} />
                            <Info label="Completed Date" value={complaint.completed_at ? formattedDate(complaint.completed_at) : "Not completed"} />
                        </div>

                        <div className="mt-6">
                            <Info label="Description" value={complaint.description} multiline />
                        </div>

                        {complaint.image && (
                            <div className="mt-6">
                                <p className="mb-2 text-sm font-semibold text-slate-700">Uploaded Image</p>
                                <img src={getComplaintImageUrl(complaint.image)} alt="Uploaded complaint" className="max-h-96 w-full rounded-2xl border border-slate-200 object-contain object-left" />
                            </div>
                        )}
                    </section>

                    <aside className="space-y-6">
                        <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-slate-800">Update Status</h2>
                            <p className="mt-2 text-sm text-slate-500">Move this complaint through the repair workflow.</p>
                            <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                                {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                            </select>
                            {!["Awaiting Verification", "Completed"].includes(complaint.status) && !(verificationRequired && complaint.status === "In Progress") && (
                                <button type="button" onClick={() => updateStatus()} disabled={savingStatus || status === complaint.status} className="mt-4 w-full rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                                    {savingStatus ? "Updating..." : "Save Status"}
                                </button>
                            )}
                            {complaint.status === "Awaiting Verification" && (
                                <div className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                                    Waiting for Admin verification.
                                </div>
                            )}
                        </section>

                        <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-slate-800">Repair Notes</h2>
                            <p className="mt-2 text-sm text-slate-500">Record the work completed or still required.</p>
                            <textarea rows="7" value={repairNotes} onChange={(event) => { setRepairNotes(event.target.value); setError(""); }} placeholder="Add repair notes..." className="mt-5 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                            {verificationRequired && complaint.status === "In Progress" ? (
                                <button type="button" onClick={submitForVerification} disabled={savingStatus} className="mt-4 w-full rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                                    {savingStatus ? "Submitting..." : "Submit for Verification"}
                                </button>
                            ) : (
                                <button type="button" onClick={saveRepairNotes} disabled={savingNotes || complaint.status === "Awaiting Verification"} className="mt-4 w-full rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                                    {savingNotes ? "Saving..." : "Save Repair Notes"}
                                </button>
                            )}
                        </section>
                    </aside>
                </div>

                {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}
            </div>
        </TechnicianLayout>
    );
}

function Info({ label, value, multiline = false }) {
    return (
        <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">{label}</p>
            <div className={`rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 ${multiline ? "min-h-28 whitespace-pre-wrap" : "min-h-12"}`}>
                {value || "Not available"}
            </div>
        </div>
    );
}

export default ComplaintDetails;
