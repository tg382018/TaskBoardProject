import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const client = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

client.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const { refreshToken, updateTokens, clearAuth } = useAuthStore.getState();

        if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post("/api/auth/refresh", { refreshToken });
                updateTokens(data.accessToken, data.refreshToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return client(originalRequest);
            } catch (refreshError) {
                clearAuth();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default client;
