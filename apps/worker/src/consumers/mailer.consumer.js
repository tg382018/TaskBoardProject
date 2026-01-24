import { logger } from "../utils/logger.js";
import { generateAndStoreOtp } from "../services/stub-auth.provider.js";

export async function handleMail(event) {
    if (event.type === "otp.requested") {
        const { to } = event;

        if (!to) {
            logger.warn("[MAILER] otp.requested event missing 'to' field");
            return;
        }

        // Generate OTP and store in Redis (StubAuthProvider simulates email sending)
        await generateAndStoreOtp(to);
    }
}
