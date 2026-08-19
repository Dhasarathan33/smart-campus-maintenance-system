import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url || "";
        const isLoginRequest = requestUrl === "/auth/login" || requestUrl.endsWith("/auth/login");
        const hasAuthenticatedSession = Boolean(localStorage.getItem("token"));

        if (
            status === 401 &&
            !isLoginRequest &&
            hasAuthenticatedSession &&
            window.location.pathname !== "/"
        ) {
            localStorage.removeItem("token");
            window.location.assign("/");
        }

        return Promise.reject(error);
    }
);

export default api;
