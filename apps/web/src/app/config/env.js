/**
 * Environment Configuration
 * Centralized access to VITE_ environment variables
 */

export const env = {
    // API
    API_URL: import.meta.env.VITE_API_URL || "/api",

    // Socket.io
    SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "",

    // App
    APP_NAME: import.meta.env.VITE_APP_NAME || "TaskBoard",

    // Feature flags
    ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",

    // Environment
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    mode: import.meta.env.MODE,
};

export default env;
