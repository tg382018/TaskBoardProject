import { logger } from "../utils/logger.js";
import { EventLog } from "../models/event.model.js";

/**
 * Report/Analytics Service
 */

const stats = {
    events: 0,
    byType: {},
};

export async function trackEvent(event) {
    stats.events++;
    stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;

    try {
        await EventLog.create({
            type: event.type,
            payload: event,
        });
        logger.debug(`[service:report] Event persisted: ${event.type}`);
    } catch (err) {
        logger.error(`[service:report] Persistence failed: ${err.message}`);
    }

    logger.info(`[service:report] Event tracked: ${event.type}. Total events: ${stats.events}`);
}

export function getStats() {
    return stats;
}

// Alias for analytics consumer
export const getEventStats = getStats;
