import { logger } from "../utils/logger.js";

export function handleMail(event) {
    if (event.type === "otp.requested") {
        logger.info(`[MAILER] Sending OTP code ${event.code} to ${event.to}`);
    }
}
