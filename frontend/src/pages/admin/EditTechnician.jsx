import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

function EditTechnician() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        college_email: "",
        phone_number: "",
        department_id: ""
    });

    const loadTechnicianData = useCallback(async () => {

        try {

            const [technicianResponse, departmentResponse] =
                await Promise.all([
                    api.get(`/technicians/${id}`),
                    api.get("/departments")
                ]);

            setDepartments(departmentResponse.data);

            setFormData({
                full_name: technicianResponse.data.full_name || "",
                college_email: technicianResponse.data.college_email || "",
                phone_number: technicianResponse.data.phone_number || "",
                department_id: technicianResponse.data.department_id || ""
            });

        } catch (error) {

            console.log(error);

            if (error.response && error.response.status === 404) {
                alert("Technician Not Found");
                navigate("/admin-technicians");
            } else {
                alert("Failed to load technician details");
            }

        } finally {

            setLoading(false);

        }

    }, [id, navigate]);

    useEffect(() => {
        const initialLoad = setTimeout(() => { void loadTechnicianData(); }, 0);
        return () => clearTimeout(initialLoad);
    }, [loadTechnicianData]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (saving) return;
        setSaving(true);

        try {

            await api.put(`/technicians/${id}`, formData);

            alert("Technician Updated Successfully");

            navigate("/admin-technicians");

        } catch (error) {

            console.log(error);

            alert("Failed to Update Technician");

        } finally {
            setSaving(false);
        }

    };

    if (loading) {

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

            <div className="mx-auto max-w-3xl rounded-xl bg-white p-5 shadow-lg sm:p-8">

                <h1 className="text-3xl font-bold text-blue-700 mb-8">
                    Edit Technician
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="font-semibold">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 mt-2"
                            required
                        />

                    </div>

                    <div>

                        <label className="font-semibold">
                            College Email
                        </label>

                        <input
                            type="email"
                            name="college_email"
                            value={formData.college_email}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 mt-2"
                            required
                        />

                    </div>

                    <div>

                        <label className="font-semibold">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 mt-2"
                            required
                        />

                    </div>

                    <div>

                        <label className="font-semibold">
                            Department
                        </label>

                        <select
                            name="department_id"
                            value={formData.department_id}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 mt-2"
                            required
                        >

                            <option value="">
                                Select Department
                            </option>

                            {departments.map((department) => (

                                <option
                                    key={department.department_id}
                                    value={department.department_id}
                                >
                                    {department.department_name}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="flex justify-end gap-4 pt-4">

                        <button
                            type="button"
                            onClick={() => navigate("/admin-technicians")}
                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </AdminLayout>

    );

}

export default EditTechnician;
