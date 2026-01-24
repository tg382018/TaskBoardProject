import { randomInt } from "crypto";
import { getRedisClient } from "../config/redis.js";
import { logger } from "../utils/logger.js";
import { sendBroadcast } from "./notify.js";

const OTP_KEY_PREFIX = "otp:email:";
const OTP_TTL_SECONDS = 5 * 60; // 5 minutes

/**
 * StubAuthProvider - Simulates an email/SMS provider for OTP delivery
 * This is a fake provider that generates OTPs and stores them in Redis
 * instead of actually sending emails.
 */

function generateOtpCode() {
    return String(randomInt(100000, 1000000)); // 6 digits, cryptographically secure
}

function buildRedisKey(email) {
    return `${OTP_KEY_PREFIX}${email}`;
}

/**
 * Generates an OTP and stores it in Redis (simulating email delivery)
 * @param {string} email - The recipient email address
 * @returns {Promise<string>} - The generated OTP code
 */
export async function generateAndStoreOtp(email) {
    const code = generateOtpCode();
    const redis = getRedisClient();
    const key = buildRedisKey(email);

    // Store OTP in Redis with TTL and attempts counter
    const value = JSON.stringify({ code, attempts: 0 });
    await redis.set(key, value, "EX", OTP_TTL_SECONDS);

    // Simulate async email sending with small delay
    await new Promise(resolve => setTimeout(resolve, 100));

    logger.info(`[StubAuthProvider] OTP ${code} sent to ${email}`);

    // Broadcast to frontend via Socket.io (for development/demo purposes)
    await sendBroadcast({
        type: "otp.stub.delivered",
        email,
        code,
    });

    return code;
}
