import mongoose from "mongoose";
import { getRedisClient } from "../../config/redis.js";

// --- Redis OTP Operations ---

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

  const ttl = await redis.ttl(key);
  if (ttl > 0) {
    await redis.set(key, JSON.stringify(data), "EX", ttl);
  } else {
    await redis.set(key, JSON.stringify(data));
  }
}

// --- Mongo Session Operations ---

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    userAgent: String,
    ip: String,
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model("Session", sessionSchema);

export async function createSession({ userId, refreshToken, userAgent, ip, expiresAt }) {
  return Session.create({
    userId,
    refreshToken,
    userAgent,
    ip,
    expiresAt,
  });
}

export async function findSessionByToken({ refreshToken }) {
  return Session.findOne({ refreshToken }).populate("userId");
}

export async function deleteSession({ refreshToken }) {
  return Session.deleteOne({ refreshToken });
}

export async function deleteUserSessions({ userId }) {
  return Session.deleteMany({ userId });
}