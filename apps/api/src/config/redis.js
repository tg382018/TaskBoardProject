// ... existing imports ...
import Redis from "ioredis";
import { logger } from "../utils/logger.js";

let redisClient = null;

export function connectRedis(redisUrl) {
  const redis = new Redis(redisUrl, { maxRetriesPerRequest: 3 });

  redis.on("connect", () => logger.info("redis connected"));
  redis.on("error", (err) => logger.error("redis error", err));

  redisClient = redis;            // << EK
  return redis;
}

// << YENİ
export function getRedisClient() {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }
  return redisClient;
}