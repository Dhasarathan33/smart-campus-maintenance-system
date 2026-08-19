import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TechnicianLayout from "../../layouts/TechnicianLayout";
import api from "../../services/api";

function AssignedComplaints() {

  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  async function fetchAssignedComplaints() {

    setLoading(true);
    setError("");

    try {

      const response = await api.get("/technicians/assigned-complaints");

      setComplaints(response.data);

    } catch (error) {

      console.log(error);
      setError("Unable to load assigned complaints right now.");

    } finally {
      setLoading(false);

    }

  };

  const filteredComplaints = useMemo(() => {

    let data = [...complaints];

    if (status !== "All") {
      data = data.filter((complaint) => complaint.status === status);
    }

    if (search !== "") {
      data = data.filter((complaint) => {
        const title = complaint.title || "";
        const location = complaint.location || "";

        return (
          title.toLowerCase().includes(search.toLowerCase()) ||
          location.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    return data;

  }, [complaints, search, status]);

  const getStatusClass = (complaintStatus) => {

    if (complaintStatus === "Assigned") {
      return "bg-blue-100 text-blue-700";
    }

    if (complaintStatus === "In Progress") {
      return "bg-orange-100 text-orange-700";
    }

    if (complaintStatus === "Awaiting Verification") {
      return "bg-purple-100 text-purple-700";
    }

    if (complaintStatus === "Completed") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-700";

  };

  const handleView = (id) => {
    navigate(`/technician-complaint/${id}`);
  };

  return (

    <TechnicianLayout>

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Assigned Complaints
          </h1>

          <p className="text-gray-500 mt-2">
            View all complaints assigned to you
          </p>

        </div>

      </div>

      <div className="bg-white rounded-xl shadow mt-8 p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg p-3"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-lg p-3"
          >
            <option value="All">All</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Awaiting Verification">Awaiting Verification</option>
            <option value="Completed">Completed</option>
          </select>

        </div>

      </div>

      <div className="mt-8 overflow-hidden rounded-xl bg-white shadow">

        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading assigned complaints...</div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-gray-600">{error}</p>
            <button
              type="button"
              onClick={fetchAssignedComplaints}
              className="mt-4 rounded-lg bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800"
            >
              Retry
            </button>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No assigned complaints match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-blue-700 text-white">

              <tr className="text-sm uppercase tracking-wide">
                <th className="p-4 text-center align-middle w-28">
                  Complaint ID
                </th>
                <th className="px-4 py-4 text-left align-middle">
                  Title
                </th>
                <th className="p-4 text-center align-middle w-48">
                  Department
                </th>
                <th className="p-4 text-center align-middle w-32">Priority</th>
                <th className="px-4 py-4 text-left align-middle">
                  Location
                </th>
                <th className="p-4 text-center align-middle w-40">
                  Status
                </th>
                <th className="p-4 text-center align-middle w-40">
                  Created Date
                </th>
                <th className="p-4 text-center align-middle w-32">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {filteredComplaints.map((complaint) => (

                <tr
                  key={complaint.complaint_id}
                  className="border-b hover:bg-gray-100 align-middle"
                >
                  <td className="px-4 py-4 text-center align-middle whitespace-nowrap">
                    {complaint.complaint_id}
                  </td>

                  <td className="px-4 py-4 text-left align-middle">
                    {complaint.title}
                  </td>

                  <td className="px-4 py-4 text-center align-middle">
                    {complaint.department_name}
                  </td>

                  <td className="px-4 py-4 text-center align-middle">
                    <PriorityBadge priority={complaint.priority} />
                  </td>

                  <td className="px-4 py-4 text-left align-middle">
                    {complaint.location}
                  </td>

                  <td className="px-4 py-4 text-center align-middle">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(complaint.status)}`}
                    >
                      {complaint.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center align-middle whitespace-nowrap">
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-4 text-center align-middle">
                    <button
                      onClick={() => handleView(complaint.complaint_id)}
                      className="w-24 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                    >
                      View
                    </button>
                  </td>
                </tr>

              ))}

            </tbody>

          </table>

          </div>
        )}

      </div>

    </TechnicianLayout>

  );

}

function PriorityBadge({ priority }) {
  const classes = { High: "bg-red-100 text-red-700", Medium: "bg-amber-100 text-amber-700", Low: "bg-green-100 text-green-700" };
  return <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${classes[priority] || "bg-gray-100 text-gray-700"}`}>{priority || "Low"}</span>;
}

export default AssignedComplaints;
