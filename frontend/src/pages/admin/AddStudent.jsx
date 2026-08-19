import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

function AddStudent() {

    const navigate = useNavigate();

    const [academicDepartments, setAcademicDepartments] = useState([]);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        college_email: "",
        phone_number: "",
        password: "",
        department_id: ""
    });

    const fetchAcademicDepartments = useCallback(async () => {

        try {

            const response = await api.get("/academic-departments");

            setAcademicDepartments(response.data);

        } catch (error) {

            console.log(error);

        }

    }, []);

    useEffect(() => {
        const initialLoad = setTimeout(() => { void fetchAcademicDepartments(); }, 0);
        return () => clearTimeout(initialLoad);
    }, [fetchAcademicDepartments]);

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
        console.log(formData);
        console.log(formData.department_id);

        try {

            await api.post("/students", formData);

            alert("Student Created Successfully");

            navigate("/admin-students");

        } catch (error) {

            console.log(error);

            alert("Failed to Add Student");

        } finally {
            setSaving(false);
        }

    };

    return (

        <AdminLayout>

            <div className="mx-auto max-w-3xl rounded-xl bg-white p-5 shadow-lg sm:p-8">

                <h1 className="text-3xl font-bold text-blue-700 mb-8">
                    Add Student
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
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
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
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >

                            <option value="">
                                Select Department
                            </option>

                            {academicDepartments.map((department) => (

                                <option
                                    key={department.department_id}
                                    value={department.department_id}
                                    className="text-black"
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
                            {saving ? "Saving..." : "Save Student"}
                        </button>

                    </div>

                </form>

            </div>

        </AdminLayout>

    );

}

export default AddStudent;
