import { UserStats } from "../models/UserStats.js";
import { logger } from "../utils/logger.js";

/**
 * Stats Consumer
 * Tracks user statistics based on events
 */
export async function handleStats(event) {
    const { type, userId, creatorId, _updatedBy, deletedBy, data, changes } = event;

    try {
        switch (type) {
            case "project.created":
                if (userId) {
                    await UserStats.incrementStat(userId, "projectsCreated");
                    logger.info(`[STATS] User ${userId}: projectsCreated++`);
                }
                break;

            case "project.deleted":
                if (userId) {
                    await UserStats.incrementStat(userId, "projectsDeleted");
                    logger.info(`[STATS] User ${userId}: projectsDeleted++`);
                }
                break;

            case "task.created": {
                // Task events use creatorId instead of userId
                const taskCreator = creatorId || userId;
                if (taskCreator) {
                    await UserStats.incrementStat(taskCreator, "tasksCreated");
                    logger.info(`[STATS] User ${taskCreator}: tasksCreated++`);
                }
                break;
            }

            case "task.deleted": {
                // Task delete events use deletedBy instead of userId
                const taskDeleter = deletedBy || userId;
                if (taskDeleter) {
                    await UserStats.incrementStat(taskDeleter, "tasksDeleted");
                    logger.info(`[STATS] User ${taskDeleter}: tasksDeleted++`);
                }
                break;
            }

            case "task.updated": {
                // Check if assignee was added/changed (changes.assigneeId from API)
                const newAssignee = changes?.assigneeId || data?.assigneeId;
                if (newAssignee) {
                    await UserStats.incrementStat(newAssignee, "tasksAssigned");
                    logger.info(`[STATS] User ${newAssignee}: tasksAssigned++`);
                }
                break;
            }

            case "task.assigned":
                // Direct assignment event
                if (data?.assigneeId) {
                    await UserStats.incrementStat(data.assigneeId, "tasksAssigned");
                    logger.info(`[STATS] User ${data.assigneeId}: tasksAssigned++`);
                }
                break;

            default:
                // Ignore other events
                break;
        }
    } catch (err) {
        logger.error(`[STATS] Failed to process event ${type}: ${err.message}`);
    }
}
