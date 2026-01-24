import dotenv from "dotenv";
import { CORS_ORIGINS } from "./cors.js";

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || "development",
    port: Number(process.env.API_PORT || 3001),

    corsOrigins: process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(",")
              .map((v) => v.trim())
              .filter(Boolean)
        : CORS_ORIGINS,

    mongoUrl: process.env.MONGO_URL || "mongodb://mongo:27017/taskboard",
    redisUrl: process.env.REDIS_URL || "redis://redis:6379",
    rabbitUrl: process.env.RABBIT_URL || "amqp://rabbitmq:5672",

    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "dev-access-secret",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret",
    jwtAccessExpiry: "15m",
    jwtRefreshExpiry: "7d",
};
