import Redis from "ioredis";
import { logger } from "../utils/logger.js";

export function connectRedis(redisUrl) {
    const redis = new Redis(redisUrl, { maxRetriesPerRequest: 3 });

    redis.on("connect", () => logger.info("redis connected"));
    redis.on("error", (err) => logger.error("redis error", err));

    return redis;
}
