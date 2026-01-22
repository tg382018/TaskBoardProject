import { sendBroadcast } from "../services/notify.js";
import { logger } from "../utils/logger.js";

export async function handleNotification(event) {
    const { type } = event;


    const success = await sendBroadcast(event);

    if (success) {
        logger.info(`[NOTIFIER][CONSUMER] Successfully handled: ${type}`);
    }
}
