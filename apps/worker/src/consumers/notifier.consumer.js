import { logger } from "../utils/logger.js";

export function handleNotification(event) {
    const { type, ...data } = event;

    if (type?.startsWith("task.")) {
        logger.info(`[NOTIFIER] Task event: ${type}`, data);
    } else if (type === "comment.added") {
        logger.info(`[NOTIFIER] New comment on task ${data.taskId} by ${data.authorId}`);
    }
}
