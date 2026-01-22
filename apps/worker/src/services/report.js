import { logger } from "../utils/logger.js";

/**
 * Report/Analytics Service
  
 */

// In-memory stats stub (aligning with current logic)
const stats = {
    events: 0,
    byType: {},
};

export function trackEvent(event) {
    stats.events++;
    stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;

    logger.info(`[service:report] Event tracked: ${event.type}. Total events: ${stats.events}`);
}

export function getStats() {
    return stats;
}
