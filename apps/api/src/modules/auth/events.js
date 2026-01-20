import { publishEvent } from "../../utils/events.js";

export async function publishOtpRequested({ channel, to, code, requestedFromIp }) {
  const payload = {
    type: "otp.requested",
    channel,
    to,
    code,
    requestedFromIp,
    requestedAt: new Date().toISOString(),
  };

  await publishEvent("otp.requested", payload);
}