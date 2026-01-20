import { getRedisClient } from "../../config/redis.js";

const OTP_KEY_PREFIX = "otp:email:";

function buildKey(identifier) {
  return `${OTP_KEY_PREFIX}${identifier}`;
}

export async function saveOtp({ identifier, code, ttlSeconds }) {
  const redis = getRedisClient();
  const key = buildKey(identifier);

  const value = JSON.stringify({ code, attempts: 0 });
  await redis.set(key, value, "EX", ttlSeconds);
}

export async function getOtp({ identifier }) {
  const redis = getRedisClient();
  const key = buildKey(identifier);

  const raw = await redis.get(key);
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function deleteOtp({ identifier }) {
  const redis = getRedisClient();
  const key = buildKey(identifier);
  await redis.del(key);
}

export async function incrementAttempts({ identifier }) {
  const redis = getRedisClient();
  const key = buildKey(identifier);

  const raw = await redis.get(key);
  if (!raw) return;

  const data = JSON.parse(raw);
  data.attempts = (data.attempts || 0) + 1;

  // TTL'i korumak için kalan süreyi oku
  const ttl = await redis.ttl(key);
  if (ttl > 0) {
    await redis.set(key, JSON.stringify(data), "EX", ttl);
  } else {
    await redis.set(key, JSON.stringify(data));
  }
}