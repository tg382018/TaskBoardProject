import Redis from "ioredis";
import { logger } from "../utils/logger.js";

let redisClient = null;

export function connectRedis(redisUrl) {
    redisClient = new Redis(redisUrl, { maxRetriesPerRequest: 3 });

    redisClient.on("connect", () => logger.info("redis connected"));
    redisClient.on("error", (err) => logger.error("redis error", err));

    return redisClient;
}

export function getRedisClient() {
    if (!redisClient) {
        throw new Error("Redis client not initialized. Call connectRedis first.");
    }
    return redisClient;
}
