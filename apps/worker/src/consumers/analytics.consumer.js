import { logger } from "../utils/logger.js";

// Basit bir bellek-içi analitik stub (gerçekte Redis/Mongo olurdu)
const stats = {
    events: 0,
    byType: {},
};

export function handleAnalytics(event) {
    stats.events++;
    stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;

    logger.info(`[ANALYTICS] Multi-event stats:`, stats);
}
