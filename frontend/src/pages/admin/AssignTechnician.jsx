import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

function AssignTechnician() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [technicians, setTechnicians] = useState([]);
    const [selectedTechnician, setSelectedTechnician] = useState("");
    const [selectedPriority, setSelectedPriority] = useState("Low");
    const [saving, setSaving] = useState(false);

    const loadComplaint = useCallback(async () => {

        try {

            
            const complaintResponse = await api.get(`/complaints/${id}`);
            const complaintData = complaintResponse.data;

            setComplaint(complaintData);
            setSelectedPriority(complaintData.priority || "Low");

            const technicianResponse = await api.get(
                `/technicians/department/${complaintData.department_id}`
            );

            setTechnicians(Array.isArray(technicianResponse.data) ? technicianResponse.data : []);

        } catch (error) {
            alert(error.response?.data?.message || "Failed to load complaint details");
        }

    }, [id]);

    useEffect(() => {
        const initialLoad = setTimeout(() => { void loadComplaint(); }, 0);
        return () => clearTimeout(initialLoad);
    }, [loadComplaint]);

    const handleAssign = async () => {

        if (saving) return;

        if (!selectedTechnician) {
            alert("Please select a technician.");
            return;
        }

        setSaving(true);

        try {

            await api.put(`/complaints/assign/${id}`, {
                technician_id: selectedTechnician,
                priority: selectedPriority
            });

            alert("Technician Assigned Successfully");

            navigate("/admin-dashboard");

        } catch (error) {
            console.log(error);
            alert("Assignment Failed");

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

            <div className="max-w-5xl mx-auto">

                <div className="rounded-2xl bg-white p-5 shadow-lg sm:p-8">

                    <h1 className="text-3xl font-bold text-blue-700 mb-8">
                        Assign Technician
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>

                            <label className="font-semibold text-gray-700">
                                Complaint ID
                            </label>

                            <input
                                type="text"
                                value={complaint.complaint_id}
                                readOnly
                                className="w-full mt-2 border rounded-lg p-3 bg-gray-100"
                            />

                        </div>

                        <div>

                            <label className="font-semibold text-gray-700">
                                Student Name
                            </label>

                            <input
                                type="text"
                                value={complaint.full_name}
                                readOnly
                                className="w-full mt-2 border rounded-lg p-3 bg-gray-100"
                            />

                        </div>

                        <div>

                            <label className="font-semibold text-gray-700">
                                Department
                            </label>

                            <input
                                type="text"
                                value={complaint.department_name}
                                readOnly
                                className="w-full mt-2 border rounded-lg p-3 bg-gray-100"
                            />

                        </div>

                        <div>

                            <label className="font-semibold text-gray-700">
                                Current Status
                            </label>

                            <input
                                type="text"
                                value={complaint.status}
                                readOnly
                                className="w-full mt-2 border rounded-lg p-3 bg-gray-100"
                            />

                        </div>

                    </div>

                    <div className="mt-6">

                        <label className="font-semibold text-gray-700">
                            Complaint Title
                        </label>

                        <input
                            type="text"
                            value={complaint.title}
                            readOnly
                            className="w-full mt-2 border rounded-lg p-3 bg-gray-100"
                        />

                    </div>

                    <div className="mt-6">

                        <label className="font-semibold text-gray-700">
                            Location
                        </label>

                        <input
                            type="text"
                            value={complaint.location}
                            readOnly
                            className="w-full mt-2 border rounded-lg p-3 bg-gray-100"
                        />

                    </div>

                    <div className="mt-6">

                        <label className="font-semibold text-gray-700">
                            Description
                        </label>

                        <textarea
                            rows="5"
                            value={complaint.description}
                            readOnly
                            className="w-full mt-2 border rounded-lg p-3 bg-gray-100 resize-none"
                        />

                    </div>

                    {complaint.image && (

                        <div className="mt-6">

                            <label className="font-semibold text-gray-700">
                                Uploaded Image
                            </label>

                            <img
                                src={complaint.image}
                                alt="Complaint"
                                className="mt-3 rounded-xl border w-72"
                            />

                        </div>

                    )}

                    <div className="mt-8">

                        <label className="font-semibold text-gray-700">
                            Priority
                        </label>

                        <select
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                            className="w-full mt-2 border rounded-lg p-3"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>

                    </div>

                    <div className="mt-8">

                        <label className="font-semibold text-gray-700">
                            Assign Technician
                        </label>

                        <select
                            value={selectedTechnician}
                            onChange={(e) =>
                                setSelectedTechnician(e.target.value)
                            }
                            className="w-full mt-2 border rounded-lg p-3"
                        >

                            <option value="">
                                Select Technician
                            </option>

                            {technicians.map((tech) => (

                                <option
                                    key={tech.technician_id}
                                    value={tech.technician_id}
                                >
                                    {tech.full_name}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="flex justify-end mt-8">

                        <button
                            onClick={handleAssign}
                            disabled={saving}
                            className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white px-8 py-3 rounded-lg font-semibold"
                        >
                            {saving ? "Assigning..." : "Assign Technician"}
                        </button>

                    </div>

                </div>

            </div>

        </AdminLayout>

    );

}

export default AssignTechnician;
