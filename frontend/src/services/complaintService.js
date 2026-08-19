import api from "./api";

// ==========================
// Get All Complaints
// ==========================
export const getAllComplaints = async () => {
    const response = await api.get("/complaints");
    return response.data;
};

// ==========================
// Create Complaint
// ==========================
export const createComplaint = async (payload) => {
    const response = await api.post("/complaints", payload);
    return response.data;
};

// Resolve backend-served complaint images for both development and deployment.
export const getComplaintImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (/^https?:\/\//i.test(imagePath)) {
        return imagePath;
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    const backendOrigin = apiBaseUrl.replace(/\/api\/?$/, "");
    const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

    return `${backendOrigin}${normalizedPath}`;
};

// ==========================
// Get Logged-in Student Complaints
// ==========================
export const getMyComplaints = async () => {
    const response = await api.get("/complaints/my");
    return response.data;
};

// ==========================
// Get Complaint By ID
// ==========================
export const getComplaintById = async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
};

// ==========================
// Assign Technician
// ==========================
export const assignTechnician = async (id, technician_id) => {
    const response = await api.put(`/complaints/assign/${id}`, {
        technician_id,
    });

    return response.data;
};

// ==========================
// Reassign Technician
// ==========================
export const reassignTechnician = async (id, technician_id) => {
    const response = await api.put(`/complaints/reassign/${id}`, {
        technician_id,
    });

    return response.data;
};

// ==========================
// Approve Complaint Completion
// ==========================
export const approveComplaintCompletion = async (id) => {
    const response = await api.put(
        `/complaints/${id}/approve-completion`
    );

    return response.data;
};

// ==========================
// Reject Complaint Completion
// ==========================
export const rejectComplaintCompletion = async (
    id,
    verification_notes
) => {
    const response = await api.put(
        `/complaints/${id}/reject-completion`,
        {
            verification_notes,
        }
    );

    return response.data;
};

// ==========================
// Delete Complaint
// ==========================
export const deleteComplaint = async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
};
