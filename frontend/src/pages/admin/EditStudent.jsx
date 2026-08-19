import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

function EditStudent() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [academicDepartments, setAcademicDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        college_email: "",
        phone_number: "",
        department_id: ""
    });

    const loadStudentData = useCallback(async () => {

        try {

            const [studentResponse, departmentResponse] = await Promise.all([
                api.get(`/students/${id}`),
                api.get("/academic-departments")
            ]);

            setAcademicDepartments(departmentResponse.data);

            setFormData({
                full_name: studentResponse.data.full_name || "",
                college_email: studentResponse.data.college_email || "",
                phone_number: studentResponse.data.phone_number || "",
                department_id: studentResponse.data.department_id || ""
            });

        } catch (error) {

            console.log(error);

            if (error.response && error.response.status === 404) {
                alert("Student Not Found");
                navigate("/admin-students");
            } else {
                alert("Failed to load student details");
            }

        } finally {

            setLoading(false);

        }

    }, [id, navigate]);

    useEffect(() => {
        const initialLoad = setTimeout(() => { void loadStudentData(); }, 0);
        return () => clearTimeout(initialLoad);
    }, [loadStudentData]);

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

            await api.put(`/students/${id}`, formData);

            alert("Student Updated Successfully");

            navigate("/admin-students");

        } catch (error) {

            console.log(error);

            alert("Failed to Update Student");

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
                    Edit Student
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
                            Academic Department
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

                            {academicDepartments.map((department) => (

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
                            onClick={() => navigate("/admin-students")}
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

export default EditStudent;
