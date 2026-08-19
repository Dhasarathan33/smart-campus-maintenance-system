import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import TechnicianLayout from "../../layouts/TechnicianLayout";

function Dashboard() {
  const fullName = localStorage.getItem("full_name") || "Technician";
  const [complaints, setComplaints] = useState([]);

  const fetchAssignedComplaints = useCallback(async () => {

    try {

      const response = await api.get("/technicians/assigned-complaints");

      setComplaints(response.data);

    } catch (error) {

      console.log(error);

    }

  }, []);

  useEffect(() => {
    const initialLoad = setTimeout(() => { void fetchAssignedComplaints(); }, 0);
    return () => clearTimeout(initialLoad);
  }, [fetchAssignedComplaints]);

  const assignedComplaints = complaints.filter(
    (complaint) => complaint.status === "Assigned"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const completedComplaints = complaints.filter(
    (complaint) => complaint.status === "Completed"
  ).length;

  return (
    <TechnicianLayout>
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome, {fullName}
      </h1>

      <p className="text-gray-500 mt-2">
        Technician Dashboard
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500">
            Assigned Complaints
          </h2>

          <p className="text-4xl font-bold text-blue-700 mt-3">
            {assignedComplaints}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500">
            In Progress
          </h2>

          <p className="text-4xl font-bold text-orange-600 mt-3">
            {inProgressComplaints}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500">
            Completed
          </h2>

          <p className="text-4xl font-bold text-green-600 mt-3">
            {completedComplaints}
          </p>
        </div>
      </div>
    </TechnicianLayout>
  );
}

export default Dashboard;
