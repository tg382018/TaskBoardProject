import { trackEvent } from "../services/report.js";
import { logger } from "../utils/logger.js";

export async function handleAnalytics(event) {
    // Using dedicated service to align with aa.txt
    await trackEvent(event);
    logger.debug(`[ANALYTICS][CONSUMER] Event processed: ${event.type}`);
}
