import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";
import TechnicianLayout from "../layouts/TechnicianLayout";
import api from "../services/api";

const emptyProfile = {
    full_name: "",
    college_email: "",
    phone_number: "",
    department_name: "",
    role: ""
};

function Settings() {
    const role = localStorage.getItem("role") || "Student";
    const [profile, setProfile] = useState(emptyProfile);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [passwords, setPasswords] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });
    const [loading, setLoading] = useState(role !== "Student");
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
    const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

    const loadProfile = useCallback(async () => {
        setLoading(true);
        setProfileMessage({ type: "", text: "" });

        try {
            const response = await api.get("/profile");
            setProfile({ ...emptyProfile, ...response.data });
            setPhoneNumber(response.data.phone_number || "");
        } catch (requestError) {
            setProfileMessage({
                type: "error",
                text: requestError.response?.data?.message || "Unable to load your profile."
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (role === "Student") return undefined;
        const initialLoad = setTimeout(() => { void loadProfile(); }, 0);
        return () => clearTimeout(initialLoad);
    }, [role, loadProfile]);

    const handleProfileSubmit = async (event) => {
        event.preventDefault();
        const trimmedPhone = phoneNumber.trim();

        if (!trimmedPhone) {
            setProfileMessage({ type: "error", text: "Phone Number is required." });
            return;
        }

        if (!/^\d+$/.test(trimmedPhone)) {
            setProfileMessage({ type: "error", text: "Phone Number must contain only digits." });
            return;
        }

        setSavingProfile(true);
        setProfileMessage({ type: "", text: "" });

        try {
            const response = await api.put("/profile", { phone_number: trimmedPhone });
            setProfile((current) => ({ ...current, phone_number: response.data.phone_number || trimmedPhone }));
            setPhoneNumber(response.data.phone_number || trimmedPhone);
            setProfileMessage({ type: "success", text: "Profile Updated Successfully" });
        } catch (requestError) {
            setProfileMessage({
                type: "error",
                text: requestError.response?.data?.message || "Unable to update your profile."
            });
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setPasswords((current) => ({ ...current, [name]: value }));
        setPasswordMessage({ type: "", text: "" });
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();

        if (!passwords.old_password || !passwords.new_password || !passwords.confirm_password) {
            setPasswordMessage({ type: "error", text: "Old password, new password, and confirm password are required." });
            return;
        }

        if (passwords.new_password !== passwords.confirm_password) {
            setPasswordMessage({ type: "error", text: "New password and confirm password do not match." });
            return;
        }

        setChangingPassword(true);
        setPasswordMessage({ type: "", text: "" });

        try {
            const response = await api.put("/change-password", passwords);
            setPasswords({ old_password: "", new_password: "", confirm_password: "" });
            setPasswordMessage({ type: "success", text: response.data.message || "Password Changed Successfully" });
        } catch (requestError) {
            setPasswordMessage({
                type: "error",
                text: requestError.response?.data?.message || "Unable to change your password."
            });
        } finally {
            setChangingPassword(false);
        }
    };

    const content = (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-6 text-white shadow-xl md:p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-blue-100">Account Preferences</p>
                <h1 className="mt-3 text-3xl font-bold md:text-4xl">Settings</h1>
                <p className="mt-3 text-sm text-blue-50 md:text-base">
                    {role === "Student" ? "Manage your account security." : "View your profile and manage account security."}
                </p>
            </div>

            {loading ? (
                <div className="rounded-3xl bg-white p-12 text-center text-slate-500 shadow-lg">Loading your settings...</div>
            ) : (
                <>
                    {role !== "Student" && (
                    <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg md:p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Profile</h2>
                            <p className="mt-1 text-sm text-slate-500">Your account information and contact details.</p>
                        </div>
                        <form onSubmit={handleProfileSubmit}>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <ReadOnlyField label="Full Name" value={profile.full_name} />
                                <ReadOnlyField label="College Email" value={profile.college_email} />
                                <ReadOnlyField label="Department" value={profile.department_name || "Not assigned"} />
                                <ReadOnlyField label="Role" value={profile.role} />
                                <div>
                                    <label htmlFor="settings-phone" className="mb-2 block text-sm font-semibold text-slate-700">Phone Number</label>
                                    <input id="settings-phone" type="text" value={phoneNumber} onChange={(event) => { setPhoneNumber(event.target.value); setProfileMessage({ type: "", text: "" }); }} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                </div>
                            </div>
                            <Message message={profileMessage} />
                            <div className="mt-6 flex justify-end">
                                <button type="submit" disabled={savingProfile} className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                                    {savingProfile ? "Saving..." : "Save Profile"}
                                </button>
                            </div>
                        </form>
                    </section>
                    )}

                    <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg md:p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">
                                {role === "Student" ? "Account Security" : "Change Password"}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {role === "Student" ? "Change Password" : "Use a strong password to keep your account secure."}
                            </p>
                        </div>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                <PasswordField label="Old Password" name="old_password" value={passwords.old_password} onChange={handlePasswordChange} />
                                <PasswordField label="New Password" name="new_password" value={passwords.new_password} onChange={handlePasswordChange} />
                                <PasswordField label="Confirm Password" name="confirm_password" value={passwords.confirm_password} onChange={handlePasswordChange} />
                            </div>
                            <Message message={passwordMessage} />
                            <div className="mt-6 flex justify-end">
                                <button type="submit" disabled={changingPassword} className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                                    {changingPassword ? "Updating..." : "Change Password"}
                                </button>
                            </div>
                        </form>
                    </section>
                </>
            )}
        </div>
    );

    if (role === "Admin") return <AdminLayout>{content}</AdminLayout>;
    if (role === "Technician") return <TechnicianLayout>{content}</TechnicianLayout>;
    return <StudentLayout>{content}</StudentLayout>;
}

function ReadOnlyField({ label, value }) {
    return (
        <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">{label}</p>
            <div className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">{value || "Not available"}</div>
        </div>
    );
}

function PasswordField({ label, name, value, onChange }) {
    return (
        <div>
            <label htmlFor={`settings-${name}`} className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
            <input id={`settings-${name}`} name={name} type="password" value={value} onChange={onChange} autoComplete="new-password" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
        </div>
    );
}

function Message({ message }) {
    if (!message.text) return null;
    return <p className={`mt-5 rounded-xl px-4 py-3 text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{message.text}</p>;
}

export default Settings;
