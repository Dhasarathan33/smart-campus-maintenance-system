import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

function Students() {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [academicDepartments, setAcademicDepartments] = useState([]);

    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("All");

    useEffect(() => {
        fetchStudents();
        fetchAcademicDepartments();
    }, []);

    async function fetchStudents() {

        try {

            const response = await api.get("/students");

            setStudents(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    async function fetchAcademicDepartments() {

        try {

            const response = await api.get("/academic-departments");

            setAcademicDepartments(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const filteredStudents = useMemo(() => {

        let data = [...students];

        if (department !== "All") {
            data = data.filter(
                (student) => student.department_name === department
            );
        }

        if (search !== "") {
            data = data.filter(
                (student) =>
                    student.full_name
                        .toLowerCase()
                        .includes(search.toLowerCase())
            );
        }

        return data;

    }, [department, search, students]);

    const handleEdit = (id) => {
        navigate(`/admin-edit-student/${id}`);
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(`/students/${id}`);

            alert("Student Deleted Successfully");

            fetchStudents();

        } catch (error) {

            console.log(error);

            alert("Failed to Delete Student");

        }

    };

    return (

        <AdminLayout>

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Student Management
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage all campus students
                    </p>

                </div>

                <button
                    onClick={() => navigate("/admin-add-student")}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold"
                >
                    + Add Student
                </button>

            </div>

            <div className="bg-white rounded-xl shadow mt-8 p-6">

                <div className="grid md:grid-cols-2 gap-5">

                    <input
                        type="text"
                        placeholder="Search Student..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg p-3"
                    />

                    <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="border rounded-lg p-3"
                    >
                        <option value="All">All Academic Departments</option>
                        {academicDepartments.map((dept) => (
                            <option
                                key={dept.department_id}
                                value={dept.department_name}
                            >
                                {dept.department_name}
                            </option>
                        ))}
                    </select>

                </div>

            </div>

            <div className="bg-white rounded-xl shadow mt-8 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px]">

                        <thead className="bg-blue-700 text-white">

                            <tr className="text-sm uppercase tracking-wide">

                                <th className="p-4 text-center align-middle w-24">
                                    ID
                                </th>
                                <th className="px-4 py-4 text-left align-middle">
                                    Name
                                </th>
                                <th className="px-4 py-4 text-left align-middle">
                                    Email
                                </th>
                                <th className="px-4 py-4 text-left align-middle">
                                    Phone
                                </th>
                                <th className="p-4 text-center align-middle w-48">
                                Academic Department
                            </th>
                                <th className="p-4 text-center align-middle w-48">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredStudents.map((student) => (

                                <tr
                                    key={student.user_id}
                                    className="border-b hover:bg-gray-100 align-middle"
                                >

                                    <td className="px-4 py-4 text-center align-middle whitespace-nowrap">
                                        {student.user_id}
                                    </td>

                                    <td className="px-4 py-4 text-left align-middle">
                                        {student.full_name}
                                    </td>

                                    <td className="px-4 py-4 text-left align-middle">
                                        {student.college_email}
                                    </td>

                                    <td className="px-4 py-4 text-left align-middle whitespace-nowrap">
                                        {student.phone_number}
                                    </td>

                                    <td className="px-4 py-4 text-center align-middle">
                                        {student.department_name}
                                    </td>

                                    <td className="px-4 py-4 text-center align-middle">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() =>
                                                    handleEdit(student.user_id)
                                                }
                                                className="w-24 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(student.user_id)
                                                }
                                                className="w-24 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </AdminLayout>

    );

}

export default Students;
