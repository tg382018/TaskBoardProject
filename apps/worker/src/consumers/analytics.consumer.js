import { trackEvent, getEventStats } from "../services/report.js";
import { logger } from "../utils/logger.js";

/**
 * Analytics Consumer
 * Saves all events to MongoDB for activity log and metrics
 */
export async function handleAnalytics(event) {
    const { type } = event;

    try {
        await trackEvent(event);

        // Log stats periodically
        const stats = getEventStats();
        if (stats.events % 10 === 0) {
            logger.info(`[ANALYTICS] Stats: ${JSON.stringify(stats.byType)}`);
        }
    } catch (err) {
        logger.error(`[ANALYTICS] Failed to process event ${type}: ${err.message}`);
    }
}
