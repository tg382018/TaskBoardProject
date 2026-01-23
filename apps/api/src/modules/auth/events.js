import { publishEvent } from "../../events/publisher.js";

/**
 * Publishes OTP request event - Worker will generate and store OTP
 */
export async function publishOtpRequested({ channel, to, requestedFromIp }) {
  const payload = {
    type: "otp.requested",
    channel,
    to,
    requestedFromIp,
    requestedAt: new Date().toISOString(),
  };

  await publishEvent("otp.requested", payload);
}