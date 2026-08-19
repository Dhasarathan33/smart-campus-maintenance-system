import { FaEye, FaUserCog, FaExchangeAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ComplaintTable({
    complaints,
    onDelete,
    loading = false,
    error = "",
    onRetry
}) {

    const navigate = useNavigate();

    return (
        <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-md">

            {loading ? (
                <div className="p-10 text-center text-gray-500">
                    Loading complaints...
                </div>
            ) : error ? (
                <div className="p-10 text-center">
                    <p className="text-gray-600">{error}</p>
                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="mt-4 rounded-lg bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800"
                        >
                            Retry
                        </button>
                    )}
                </div>
            ) : complaints.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                    No complaints found.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">

                <thead className="bg-blue-700 text-white">

                    <tr className="text-left text-sm uppercase tracking-wide">
                        <th className="p-4 text-center">ID</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Department</th>
                        <th className="p-4">Title</th>
                        <th className="p-4 text-center">Priority</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>

                </thead>

                <tbody>

                    {complaints.map((complaint) => (

                        <tr
                            key={complaint.complaint_id}
                            className="border-b align-middle hover:bg-gray-50"
                        >

                            <td className="whitespace-nowrap p-4 text-center">
                                {complaint.complaint_id}
                            </td>

                            <td className="p-4 text-gray-700">
                                {complaint.full_name}
                            </td>

                            <td className="p-4 text-gray-700">
                                {complaint.department_name}
                            </td>

                            <td className="max-w-xs p-4 font-medium text-gray-800">
                                <span className="line-clamp-2">{complaint.title}</span>
                            </td>

                            <td className="p-4 text-center">
                                <PriorityBadge priority={complaint.priority} />
                            </td>

                            <td className="p-4 text-center">

                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        complaint.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : complaint.status === "Assigned"
                                            ? "bg-blue-100 text-blue-700"
                                            : complaint.status === "In Progress"
                                            ? "bg-orange-100 text-orange-700"
                                            : complaint.status === "Awaiting Verification"
                                            ? "bg-purple-100 text-purple-700"
                                            : complaint.status === "Completed"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {complaint.status}
                                </span>

                            </td>

                            <td>

                                <div className="flex justify-center gap-3">

                                    {complaint.status === "Pending" && (
                                        <button
                                            title="Assign Technician"
                                            onClick={() =>
                                                navigate(
                                                    `/assign-technician/${complaint.complaint_id}`
                                                )
                                            }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                                        >
                                            <FaUserCog />
                                        </button>
                                    )}

                                    {["Assigned", "In Progress"].includes(complaint.status) && (
                                        <>
                                            <button
                                                title="Reassign Technician"
                                                onClick={() =>
                                                    navigate(
                                                        `/reassign-technician/${complaint.complaint_id}`
                                                    )
                                                }
                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                                            >
                                                <FaExchangeAlt />
                                            </button>

                                            <button
                                                title="View Complaint"
                                                onClick={() => navigate(`/admin-complaint/${complaint.complaint_id}`)}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 p-2 text-white hover:bg-green-700"
                                            >
                                                <FaEye />
                                            </button>
                                        </>
                                    )}

                                    {complaint.status === "Completed" && (
                                        <button
                                            title="View Complaint"
                                            onClick={() => navigate(`/admin-complaint/${complaint.complaint_id}`)}
                                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 p-2 text-white hover:bg-green-700"
                                        >
                                            <FaEye />
                                        </button>
                                    )}

                                    {complaint.status === "Awaiting Verification" && (
                                        <button
                                            title="View Complaint"
                                            onClick={() => navigate(`/admin-complaint/${complaint.complaint_id}`)}
                                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 p-2 text-white hover:bg-green-700"
                                        >
                                            <FaEye />
                                        </button>
                                    )}

                                    {/* Delete */}
                                    <button
                                        onClick={() =>
                                            onDelete(complaint.complaint_id)
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                                    >
                                        <FaTrash />
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

                    </table>
                </div>
            )}

        </div>
    );
}

function PriorityBadge({ priority }) {
    const classes = {
        High: "bg-red-100 text-red-700",
        Medium: "bg-amber-100 text-amber-700",
        Low: "bg-green-100 text-green-700"
    };

    return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${classes[priority] || "bg-gray-100 text-gray-700"}`}>{priority || "Low"}</span>;
}

export default ComplaintTable;
