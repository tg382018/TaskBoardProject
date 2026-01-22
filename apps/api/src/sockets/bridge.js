import { handleTaskEvent } from "./handlers/tasks.js";
import { handleNotificationEvent } from "./handlers/notifications.js";
import { logger } from "../utils/logger.js";

/**
 * Event Bridge Logic
 * Transmits events from Worker -> Socket Clients
 */
export function broadcastEvent(io, payload) {
    const { type, projectId, userId } = payload;

    logger.debug(`[bridge] Routing event ${type}`);

    // Task & Comment related events
    if (projectId || type.startsWith("task.") || type.startsWith("comment.")) {
        handleTaskEvent(io, payload);
    }

    // Personal notifications
    if (userId || type === "notification") {
        handleNotificationEvent(io, payload);
    }
}
