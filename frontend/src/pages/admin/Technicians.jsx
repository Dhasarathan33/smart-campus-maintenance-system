import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

function Technicians() {

    const navigate = useNavigate();

    const [technicians, setTechnicians] = useState([]);

    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("All");

    useEffect(() => {
        fetchTechnicians();
    }, []);

    async function fetchTechnicians() {

        try {

            const response = await api.get("/technicians");

            setTechnicians(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const filteredTechnicians = useMemo(() => {

        let data = [...technicians];

        if (department !== "All") {

            data = data.filter(
                (tech) => tech.department_name === department
            );

        }

        if (search !== "") {

            data = data.filter(
                (tech) =>
                    tech.full_name
                        .toLowerCase()
                        .includes(search.toLowerCase())
            );

        }

        return data;

    }, [department, search, technicians]);

    const handleEdit = (id) => {
        navigate(`/admin-edit-technician/${id}`);
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this technician?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(`/technicians/${id}`);

            alert("Technician Deleted Successfully");

            fetchTechnicians();

        } catch (error) {

            console.log(error);

            alert("Failed to Delete Technician");

        }

    };

    return (

        <AdminLayout>

            {/* Header */}

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Technician Management
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage all campus technicians
                    </p>

                </div>

                <button
                    onClick={() => navigate("/admin-add-technician")}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold"
                >
                    + Add Technician
                </button>

            </div>

            {/* Filters */}

            <div className="bg-white rounded-xl shadow mt-8 p-6">

                <div className="grid md:grid-cols-2 gap-5">

                    <input
                        type="text"
                        placeholder="Search Technician..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="border rounded-lg p-3"
                    />

                    <select
                        value={department}
                        onChange={(e) =>
                            setDepartment(e.target.value)
                        }
                        className="border rounded-lg p-3"
                    >

                        <option>All</option>
                        <option>Electrical</option>
                        <option>Plumbing</option>
                        <option>Technical</option>

                    </select>

                </div>

            </div>

            {/* Technician Table */}

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
                                    Department
                                </th>
                                <th className="p-4 text-center align-middle w-48">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredTechnicians.map((tech) => (

                                <tr
                                    key={tech.technician_id}
                                    className="border-b hover:bg-gray-100 align-middle"
                                >

                                    <td className="px-4 py-4 text-center align-middle whitespace-nowrap">
                                        {tech.technician_id}
                                    </td>

                                    <td className="px-4 py-4 text-left align-middle">
                                        {tech.full_name}
                                    </td>

                                    <td className="px-4 py-4 text-left align-middle">
                                        {tech.college_email}
                                    </td>

                                    <td className="px-4 py-4 text-left align-middle whitespace-nowrap">
                                        {tech.phone_number}
                                    </td>

                                    <td className="px-4 py-4 text-center align-middle">
                                        {tech.department_name}
                                    </td>

                                    <td className="px-4 py-4 text-center align-middle">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() =>
                                                    handleEdit(tech.technician_id)
                                                }
                                                className="w-24 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(tech.technician_id)
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

export default Technicians;
