import axios from "axios";
import { config } from "../config/env.js";
import { logger } from "../utils/logger.js";

/**
 * Notification Service
  
 */
export async function sendBroadcast(event) {
    const { type, ...data } = event;

    try {
        // Forward to API Bridge (B3-T2 logic)
        await axios.post(`${config.apiUrl}/internal/broadcast`, {
            type,
            projectId: data.projectId,
            userId: data.userId || data.assigneeId,
            data: data
        });

        logger.debug(`[service:notify] Event broadcasted: ${type}`);
        return true;
    } catch (err) {
        logger.error(`[service:notify] Failed to broadcast ${type}:`, err.message);
        return false;
    }
}
