import { saveOtp, getOtp, deleteOtp, incrementAttempts } from "./repository.js";
import { publishOtpRequested } from "./events.js";

const OTP_TTL_SECONDS = 5 * 60;
const MAX_ATTEMPTS = 5;

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 haneli
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
}