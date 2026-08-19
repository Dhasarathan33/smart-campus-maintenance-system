import { useCallback, useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import api from "../../services/api";

function Dashboard() {
  const fullName = localStorage.getItem("full_name") || "Student";
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = useCallback(async () => {
    try {
      const response = await api.get("/complaints/my");
      const studentComplaints = response.data
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setComplaints(studentComplaints);
    } catch (error) {
      console.log(error);
      setComplaints([]);
    }
  }, []);

  useEffect(() => {
    const initialLoad = setTimeout(() => { void fetchComplaints(); }, 0);
    return () => clearTimeout(initialLoad);
  }, [fetchComplaints]);

  const pendingComplaints = complaints.filter((complaint) => complaint.status === "Pending").length;
  const assignedComplaints = complaints.filter((complaint) => complaint.status === "Assigned").length;
  const completedComplaints = complaints.filter((complaint) => complaint.status === "Completed").length;

  return (
    <StudentLayout>
      <h1 className="text-3xl font-bold text-gray-800">Welcome, {fullName}</h1>
      <p className="text-gray-500 mt-2">Student Dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        <StatCard label="Total Complaints" value={complaints.length} color="text-blue-700" />
        <StatCard label="Pending" value={pendingComplaints} color="text-yellow-500" />
        <StatCard label="Assigned" value={assignedComplaints} color="text-indigo-600" />
        <StatCard label="Completed" value={completedComplaints} color="text-green-600" />
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-gray-800">Complaint Status Guide</h2>
        <p className="mt-2 text-gray-500">
          Understand what each complaint status means.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatusGuideItem
            label="Pending"
            description="Your complaint is waiting for assignment."
            color="border-yellow-200 bg-yellow-50 text-yellow-700"
          />
          <StatusGuideItem
            label="Assigned"
            description="A technician has been assigned to your complaint."
            color="border-blue-200 bg-blue-50 text-blue-700"
          />
          <StatusGuideItem
            label="Completed"
            description="The maintenance issue has been resolved."
            color="border-green-200 bg-green-50 text-green-700"
          />
        </div>

        <p className="mt-6 rounded-lg bg-gray-50 px-4 py-3 text-center text-gray-600">
          You can track the full details of your complaints from the My Complaints page.
        </p>
      </div>
    </StudentLayout>
  );
}

function StatusGuideItem({ label, description, color }) {
  return (
    <div className={`rounded-lg border p-5 ${color}`}>
      <p className="font-bold">{label}</p>
      <p className="mt-2 text-sm leading-6 text-gray-700">{description}</p>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-gray-500">{label}</h2>
      <p className={`text-4xl font-bold mt-3 ${color}`}>{value}</p>
    </div>
  );
}

export default Dashboard;
