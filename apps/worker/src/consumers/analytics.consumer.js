import { trackEvent } from "../services/report.js";
import { logger } from "../utils/logger.js";

export function handleAnalytics(event) {

    trackEvent(event);
    logger.debug(`[ANALYTICS][CONSUMER] Event processed: ${event.type}`);
}
