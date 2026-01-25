import { ROOMS } from "../rooms.js";
import { logger } from "../../utils/logger.js";

/**
 * Notification Socket Handlers
 */
export function handleNotificationEvent(io, payload) {
    const { userId } = payload;

    if (userId) {
        logger.debug(`[socket:notifications] Emitting private notification to user:${userId}`);
        io.of("/realtime").to(ROOMS.USER(userId)).emit("notification", payload);
        //ilgili odadaki tüm clientlara emit ediyoruz
    }
}
