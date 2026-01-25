import axios from "axios";
import { useAuthStore } from "../store/auth.store";
import { env } from "../config/env";

const client = axios.create({
    baseURL: env.API_URL,
    withCredentials: true, // Enable sending cookies
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor removed as tokens are now in cookies
client.interceptors.request.use((config) => config);

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const { isAuthenticated, clearAuth, setAuth } = useAuthStore.getState();

        // If 401 and we are supposedly authenticated, try refresh
        if (error.response?.status === 401 && isAuthenticated && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Refresh request will automatically include the refreshToken cookie
                const { data } = await axios.post(
                    `${env.API_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                // Update user state after successful refresh
                if (data.user) {
                    setAuth({ user: data.user });
                }
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
