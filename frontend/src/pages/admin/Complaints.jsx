import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ComplaintTable from "../../components/ComplaintTable";
import {
    getAllComplaints,
    deleteComplaint
} from "../../services/complaintService";

function Complaints() {

    const [complaints, setComplaints] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [priority, setPriority] = useState("All");
    const [prioritySort, setPrioritySort] = useState("desc");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchComplaints();
    }, []);

    async function fetchComplaints() {
        setLoading(true);
        setError("");

        try {

            const data = await getAllComplaints();

            setComplaints(data);

        } catch (error) {

            console.log(error);
            setError("Unable to load complaints right now.");

        } finally {
            setLoading(false);
        }

    };

    const filteredComplaints = useMemo(() => {

        let data = [...complaints];

        if (status !== "All") {

            data = data.filter(
                (complaint) => complaint.status === status
            );

        }

        if (priority !== "All") {
            data = data.filter((complaint) => (complaint.priority || "Low") === priority);
        }

        if (search !== "") {

            data = data.filter(
                (complaint) =>
                    complaint.title
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||

                    complaint.full_name
                        .toLowerCase()
                        .includes(search.toLowerCase())
            );

        }

        const order = { High: 3, Medium: 2, Low: 1 };
        data.sort((a, b) => {
            const difference = (order[a.priority || "Low"] || 1) - (order[b.priority || "Low"] || 1);
            return prioritySort === "desc" ? -difference : difference;
        });
        return data;

    }, [complaints, priority, prioritySort, search, status]);

    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this complaint?")) return;

        try {
            await deleteComplaint(id);
            alert("Complaint Deleted Successfully");
            fetchComplaints();
        } catch (error) {
            console.error(error);
        }

    };

    return (

        <AdminLayout>

            <div className="flex justify-between items-center">

                <h1 className="text-3xl font-bold">
                    Complaint Management
                </h1>

            </div>

            <div className="bg-white rounded-xl shadow mt-8 p-6">

                <div className="grid md:grid-cols-4 gap-5">

                    <input
                        type="text"
                        placeholder="Search by Student or Complaint..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="border rounded-lg p-3"
                    />

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                        className="border rounded-lg p-3"
                    >

                        <option>All</option>
                        <option>Pending</option>
                        <option>Assigned</option>
                        <option>In Progress</option>
                        <option>Awaiting Verification</option>
                        <option>Completed</option>

                    </select>

                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border rounded-lg p-3">
                        <option value="All">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    <select value={prioritySort} onChange={(e) => setPrioritySort(e.target.value)} className="border rounded-lg p-3">
                        <option value="desc">High to Low</option>
                        <option value="asc">Low to High</option>
                    </select>

                </div>

            </div>

            <ComplaintTable
                complaints={filteredComplaints}
                onDelete={handleDelete}
                loading={loading}
                error={error}
                onRetry={fetchComplaints}
            />

        </AdminLayout>

    );

}

export default Complaints;
