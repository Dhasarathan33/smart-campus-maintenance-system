import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import api from "../../services/api";
import { createComplaint } from "../../services/complaintService";

function CreateComplaint() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    department_id: "",
    title: "",
    description: "",
    location: "",
    image: null,
  });

  const fetchDepartments = useCallback(async () => {
    setLoadingDepartments(true);

    try {
      const response = await api.get("/departments");
      setDepartments(response.data);
    } catch (error) {
      console.log(error);
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = setTimeout(() => {
      void fetchDepartments();
    }, 0);

    return () => clearTimeout(initialLoad);
  }, [fetchDepartments]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setFormData({
        ...formData,
        image: null,
      });
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a JPG, JPEG, PNG, or WEBP image.");
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setFormData({
      ...formData,
      image: file,
    });
  };

  const resetForm = () => {
    setFormData({
      department_id: "",
      title: "",
      description: "",
      location: "",
      image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (
      !formData.department_id ||
      !formData.title ||
      !formData.description ||
      !formData.location
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append("department_id", formData.department_id);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("location", formData.location);

      if (formData.image) {
        data.append("image", formData.image);
      }

      await createComplaint(data);

      resetForm();

      setSuccessMessage("Complaint submitted successfully.");

      setTimeout(() => {
        navigate("/student-my-complaints");
      }, 800);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to submit complaint"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StudentLayout>
      <div className="rounded-xl bg-white p-5 shadow sm:p-6">

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/student-dashboard")}
          className="mb-6 flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900"
        >
          ← Back to Dashboard
        </button>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800">
          Create Complaint
        </h1>

        <p className="mt-2 text-gray-500">
          Submit a campus maintenance issue for review.
        </p>

        {/* Success message */}
        {successMessage && (
          <div
            className="mt-6 rounded-lg bg-green-100 px-4 py-3 font-semibold text-green-700"
            role="status"
          >
            {successMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2"
        >

          {/* Department */}
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Department
            </label>

            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              className="w-full rounded-lg border bg-white p-3"
              required
              disabled={loadingDepartments}
            >
              <option value="">
                {loadingDepartments
                  ? "Loading departments..."
                  : "Select Department"}
              </option>

              {departments.map((department) => (
                <option
                  key={department.department_id}
                  value={department.department_id}
                >
                  {department.department_name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              placeholder="Enter complaint title"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-semibold text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full resize-none rounded-lg border p-3"
              placeholder="Describe the issue"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              placeholder="Building, floor, or room"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label
              htmlFor="complaint-image"
              className="mb-2 block font-semibold text-gray-700"
            >
              Image Upload
            </label>

            <input
              id="complaint-image"
              type="file"
              name="image"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full rounded-lg border bg-white p-3 text-sm"
            />

            {formData.image && (
              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  Selected: {formData.image.name}
                </p>

                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Selected complaint"
                  className="mt-3 h-32 w-32 rounded-lg border object-cover"
                />
              </div>
            )}

            <p className="mt-2 text-xs text-gray-400">
              JPG, JPEG, PNG or WEBP • Maximum 5 MB
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end md:col-span-2">

            <button
              type="button"
              onClick={() => navigate("/student-dashboard")}
              className="mr-3 rounded-lg bg-gray-200 px-6 py-3 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-700 px-6 py-3 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Complaint"}
            </button>

          </div>

        </form>
      </div>
    </StudentLayout>
  );
}

export default CreateComplaint;