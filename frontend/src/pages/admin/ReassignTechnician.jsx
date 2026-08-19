import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import { reassignTechnician } from "../../services/complaintService";

function ReassignTechnician() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [technicians, setTechnicians] = useState([]);
    const [selectedTechnician, setSelectedTechnician] = useState("");
    const [saving, setSaving] = useState(false);

    const loadComplaint = useCallback(async () => {

        try {
            const complaintResponse = await api.get(`/complaints/${id}`);
            const complaintData = complaintResponse.data;

            if (!["Assigned", "In Progress"].includes(complaintData.status)) {
                alert("Only Assigned or In Progress complaints can be reassigned");
                navigate("/admin-complaints");
                return;
            }

            setComplaint(complaintData);

            const technicianResponse = await api.get(
                `/technicians/department/${complaintData.department_id}`
            );

            setTechnicians(Array.isArray(technicianResponse.data) ? technicianResponse.data : []);

        } catch (error) {
            alert(error.response?.data?.message || "Failed to load complaint details");
            navigate("/admin-complaints");
        }

    }, [id, navigate]);

    useEffect(() => {
        const initialLoad = setTimeout(() => { void loadComplaint(); }, 0);
        return () => clearTimeout(initialLoad);
    }, [loadComplaint]);

    const handleReassign = async () => {

        if (!selectedTechnician) {
            alert("Please select a technician.");
            return;
        }

        setSaving(true);

        try {
            await reassignTechnician(id, selectedTechnician);

            alert("Technician Reassigned Successfully");
            navigate("/admin-complaints");

        } catch (error) {
            alert(error.response?.data?.message || "Reassignment Failed");
        } finally {
            setSaving(false);
        }

    };

    if (!complaint) {
        return (
            <AdminLayout>
                <div className="text-center text-2xl font-semibold mt-20">
                    Loading...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto">
                <div className="rounded-2xl bg-white p-5 shadow-lg sm:p-8">
                    <h1 className="text-3xl font-bold text-blue-700 mb-8">
                        Reassign Technician
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="font-semibold text-gray-700">
                                Current Technician
                            </label>
                            <input
                                type="text"
                                value={complaint.technician_name || "Not Assigned"}
                                readOnly
                                className="w-full mt-2 border rounded-lg p-3 bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-gray-700">
                                Current Priority
                            </label>
                            <input
                                type="text"
                                value={complaint.priority || "Low"}
                                readOnly
                                className="w-full mt-2 border rounded-lg p-3 bg-gray-100"
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <label className="font-semibold text-gray-700">
                            New Technician
                        </label>
                        <select
                            value={selectedTechnician}
                            onChange={(event) => setSelectedTechnician(event.target.value)}
                            className="w-full mt-2 border rounded-lg p-3"
                        >
                            <option value="">Select Technician</option>
                            {technicians.map((technician) => (
                                <option
                                    key={technician.technician_id}
                                    value={technician.technician_id}
                                >
                                    {technician.full_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={() => navigate("/admin-complaints")}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleReassign}
                            disabled={saving}
                            className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            {saving ? "Reassigning..." : "Confirm Reassignment"}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default ReassignTechnician;
