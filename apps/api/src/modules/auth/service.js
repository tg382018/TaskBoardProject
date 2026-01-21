import { randomInt } from "crypto";
import {
  saveOtp, getOtp, deleteOtp, incrementAttempts,
  createSession, findSessionByToken, deleteSession
} from "./repository.js";
import { findOrCreateUser } from "../users/repository.js";
import { publishOtpRequested } from "./events.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";

const OTP_TTL_SECONDS = 5 * 60;
const MAX_ATTEMPTS = 5;

function generateOtpCode() {
  return String(randomInt(100000, 1000000)); // 6 haneli, kriptografik güvenli
}

export async function requestOtp({ email, ip }) {
  if (!email) throw new Error("email is required");

  const code = generateOtpCode();

  await saveOtp({
    identifier: email,
    code,
    ttlSeconds: OTP_TTL_SECONDS,
  });

  await publishOtpRequested({
    channel: "email",
    to: email,
    code,
    requestedFromIp: ip,
  });
}

export async function verifyOtp({ email, code }) {
  if (!email || !code) throw new Error("email and code are required");

  const record = await getOtp({ identifier: email });
  if (!record) {
    throw new Error("OTP invalid or expired");
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    throw new Error("Too many attempts");
  }

  if (record.code !== code) {
    await incrementAttempts({ identifier: email });
    throw new Error("OTP invalid or expired");
  }

  await deleteOtp({ identifier: email });

  const user = await findOrCreateUser({ email });

  // Token'ları üret
  const accessToken = signAccessToken({ sub: user._id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ sub: user._id });

  await createSession({
    userId: user._id,
    refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün
  });

  return { accessToken, refreshToken, user };
}

export async function refreshTokens({ refreshToken }) {
  if (!refreshToken) throw new Error("Refresh token required");

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) throw new Error("Invalid or expired refresh token");

  const session = await findSessionByToken({ refreshToken });
  if (!session) throw new Error("Session not found");

  // Eski session'ı sil (rotasyon)
  await deleteSession({ refreshToken });

  const user = session.userId;
  const newAccessToken = signAccessToken({ sub: user._id, email: user.email, role: user.role });
  const newRefreshToken = signRefreshToken({ sub: user._id });

  await createSession({
    userId: user._id,
    refreshToken: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken, user };
}

export async function logout({ refreshToken }) {
  if (!refreshToken) return;
  await deleteSession({ refreshToken });
}