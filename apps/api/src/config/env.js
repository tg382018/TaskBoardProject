import dotenv from "dotenv";

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || "development",
    port: Number(process.env.API_PORT || 3001),
    corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:5173")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
};
