import { useCallback, useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import api from "../../services/api";

const initialProfile = {
    full_name: "",
    college_email: "",
    phone_number: "",
    academic_department: "",
    role: ""
};

function Profile() {
    const [profile, setProfile] = useState(initialProfile);
    const [formData, setFormData] = useState({ full_name: "", phone_number: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadProfile = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/students/profile");
            const loadedProfile = { ...initialProfile, ...response.data };
            setProfile(loadedProfile);
            setFormData({
                full_name: loadedProfile.full_name || "",
                phone_number: loadedProfile.phone_number || ""
            });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to load your profile right now.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const initialLoad = setTimeout(() => { void loadProfile(); }, 0);
        return () => clearTimeout(initialLoad);
    }, [loadProfile]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
        setError("");
        setSuccess("");
    };

    const handleEdit = () => {
        setFormData({
            full_name: profile.full_name || "",
            phone_number: profile.phone_number || ""
        });
        setError("");
        setSuccess("");
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({
            full_name: profile.full_name || "",
            phone_number: profile.phone_number || ""
        });
        setError("");
        setIsEditing(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const fullName = formData.full_name.trim();
        const phoneNumber = formData.phone_number.trim();

        if (!fullName) {
            setError("Full Name is required.");
            return;
        }

        if (!phoneNumber) {
            setError("Phone Number is required.");
            return;
        }

        if (!/^\d+$/.test(phoneNumber)) {
            setError("Phone Number must contain only digits.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await api.put("/students/profile", {
                full_name: fullName,
                phone_number: phoneNumber
            });

            const updatedProfile = { ...profile, full_name: fullName, phone_number: phoneNumber };
            setProfile(updatedProfile);
            setFormData({ full_name: fullName, phone_number: phoneNumber });
            localStorage.setItem("full_name", fullName);
            localStorage.setItem("user", JSON.stringify({
                ...JSON.parse(localStorage.getItem("user") || "{}"),
                full_name: fullName
            }));
            setIsEditing(false);
            setSuccess("Profile Updated Successfully");
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to update your profile right now.");
        } finally {
            setSaving(false);
        }
    };

    const fields = [
        { label: "Full Name", name: "full_name", editable: true },
        { label: "College Email", name: "college_email", editable: false },
        { label: "Phone Number", name: "phone_number", editable: true },
        { label: "Department", name: "academic_department", editable: false }
    ];

    return (
        <StudentLayout>
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-6 text-white shadow-xl md:p-8">
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white ring-2 ring-white/40">
                            {(profile.full_name || "S").charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-blue-100">Student Account</p>
                            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Student Profile</h1>
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-blue-50 md:text-base">Manage your personal information</p>
                </div>

                <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg md:p-8">
                    {loading ? (
                        <p className="py-10 text-center text-slate-500">Loading your profile...</p>
                    ) : error && !profile.full_name ? (
                        <div className="py-8 text-center">
                            <p className="text-red-600">{error}</p>
                            <button type="button" onClick={loadProfile} className="mt-4 rounded-xl bg-blue-700 px-5 py-3 text-white hover:bg-blue-800">
                                Retry
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                {fields.map((field) => {
                                    const value = field.editable ? formData[field.name] : profile[field.name];
                                    return (
                                        <div key={field.name}>
                                            <label htmlFor={field.name} className="mb-2 block text-sm font-semibold text-slate-700">
                                                {field.label}
                                            </label>
                                            <input
                                                id={field.name}
                                                name={field.name}
                                                type="text"
                                                value={value || ""}
                                                onChange={field.editable ? handleChange : undefined}
                                                readOnly={!field.editable || !isEditing}
                                                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                                                    !field.editable || !isEditing
                                                        ? "border-slate-200 bg-slate-50 text-slate-600"
                                                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                }`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                            {success && <p className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}

                            <div className="mt-8 flex flex-wrap justify-end gap-3">
                                {!isEditing ? (
                                    <button type="button" onClick={handleEdit} className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-800">
                                        Edit
                                    </button>
                                ) : (
                                    <>
                                        <button type="button" onClick={handleCancel} disabled={saving} className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={saving} className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                                            {saving ? "Saving..." : "Save Profile"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}

export default Profile;
