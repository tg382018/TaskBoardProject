import { sendBroadcast } from "../services/notify.js";
import { logger } from "../utils/logger.js";

// Events that should be broadcasted to frontend via Socket.io
const BROADCASTABLE_EVENTS = [
    "task.created",
    "task.updated",
    "task.deleted",
    "task.assigned",
    "comment.added",
    "comment.deleted",
];

export async function handleNotification(event) {
    const { type } = event;

    // Skip events that shouldn't be broadcasted (like OTP)
    if (!BROADCASTABLE_EVENTS.includes(type)) {
        logger.debug(`[NOTIFIER] Skipping non-broadcastable event: ${type}`);
        return;
    }

    // Broadcast to frontend via Socket.io
    const success = await sendBroadcast(event);

    if (success) {
        logger.info(
            `[NOTIFIER] Broadcasted event: ${type} | projectId: ${event.projectId || "N/A"}`
        );
    } else {
        logger.warn(`[NOTIFIER] Failed to broadcast: ${type}`);
    }
}
