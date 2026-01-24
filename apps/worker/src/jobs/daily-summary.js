import mongoose from "mongoose";
import cron from "node-cron";
import { logger } from "../utils/logger.js";

/**
 * Daily Summary Cron Job
 * Runs at 00:00 every day, collects last 24 hours of user activities
 * and saves to UserDailySummary collection
 */

// EventLog model (shared with analytics consumer)
const EventLog =
    mongoose.models.EventLog ||
    mongoose.model(
        "EventLog",
        new mongoose.Schema({
            type: String,
            payload: mongoose.Schema.Types.Mixed,
            processedAt: Date,
        })
    );

// UserDailySummary model - stores daily summaries per user
const userDailySummarySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, index: true },
    activities: [
        {
            eventType: { type: String },
            message: { type: String },
            projectName: { type: String },
            taskTitle: { type: String },
            timestamp: { type: Date },
        },
    ],
    stats: {
        tasksCreated: { type: Number, default: 0 },
        tasksUpdated: { type: Number, default: 0 },
        commentsAdded: { type: Number, default: 0 },
        projectsJoined: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now },
});

userDailySummarySchema.index({ userId: 1, date: 1 }, { unique: true });

const UserDailySummary =
    mongoose.models.UserDailySummary || mongoose.model("UserDailySummary", userDailySummarySchema);

// Format event to readable message
function formatActivityMessage(event) {
    const type = event.type;
    const payload = event.payload || {};
    const data = payload.data || payload;

    switch (type) {
        case "task.created":
            return {
                type: "task_created",
                message: `Created task "${data.title || "Untitled"}"`,
                taskTitle: data.title,
            };
        case "task.updated": {
            const changes = data.changes || {};
            const taskTitleForUpdate = data.taskTitle || data.title || "a task";
            if (changes.status) {
                return {
                    type: "status_changed",
                    message: `Changed "${taskTitleForUpdate}" status to ${changes.status}`,
                    taskTitle: taskTitleForUpdate,
                };
            }
            if (changes.title) {
                return {
                    type: "title_changed",
                    message: `Changed task title to "${changes.title}"`,
                    taskTitle: changes.title,
                };
            }
            return {
                type: "task_updated",
                message: `Updated task "${taskTitleForUpdate}"`,
                taskTitle: taskTitleForUpdate,
            };
        }
        case "task.assigned":
            return {
                type: "task_assigned",
                message: "Was assigned to a task",
                taskTitle: data.title,
            };
        case "comment.added": {
            const commentTaskTitle = data.taskTitle || "a task";
            return {
                type: "comment_added",
                message: `Commented on "${commentTaskTitle}": "${(data.content || "").substring(0, 20)}..."`,
                taskTitle: commentTaskTitle,
            };
        }
        case "project.created":
            return {
                type: "project_created",
                message: `Created project "${data.title || "Untitled"}"`,
            };
        case "project.member.added":
            return {
                type: "member_added",
                message: `Added ${data.memberEmail || "a member"} to project`,
            };
        default:
            return {
                type: type,
                message: type.replace(/\./g, " "),
            };
    }
}

async function generateDailySummaries() {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    logger.info(
        `[CRON] Daily Summary: Processing events from ${yesterday.toISOString()} to ${now.toISOString()}`
    );

    try {
        // Get all events from last 24 hours
        const events = await EventLog.find({
            processedAt: { $gte: yesterday, $lt: now },
        })
            .sort({ processedAt: 1 })
            .lean();

        logger.info(`[CRON] Found ${events.length} events in last 24 hours`);

        if (events.length === 0) {
            logger.info("[CRON] No events to process");
            return;
        }

        // Group events by user
        const userActivities = {};

        for (const event of events) {
            const payload = event.payload || {};
            const data = payload.data || payload;

            // Get user ID from various fields
            const userId = String(
                data.creatorId ||
                    data.updatedBy ||
                    data.authorId ||
                    data.triggeredBy ||
                    data.userId ||
                    payload.creatorId ||
                    payload.updatedBy ||
                    payload.authorId ||
                    ""
            );

            if (!userId || userId === "undefined") continue;

            if (!userActivities[userId]) {
                userActivities[userId] = {
                    activities: [],
                    stats: {
                        tasksCreated: 0,
                        tasksUpdated: 0,
                        commentsAdded: 0,
                        projectsJoined: 0,
                    },
                };
            }

            const formatted = formatActivityMessage(event);

            userActivities[userId].activities.push({
                eventType: formatted.type,
                message: formatted.message,
                projectName: data.projectName || "",
                taskTitle: formatted.taskTitle || "",
                timestamp: event.processedAt,
            });

            // Update stats
            if (event.type === "task.created") userActivities[userId].stats.tasksCreated++;
            if (event.type === "task.updated") userActivities[userId].stats.tasksUpdated++;
            if (event.type === "comment.added") userActivities[userId].stats.commentsAdded++;
            if (event.type === "project.member.added")
                userActivities[userId].stats.projectsJoined++;
        }

        // Save summaries to database
        const summaryDate = new Date(yesterday.toISOString().split("T")[0]); // Midnight of yesterday

        for (const [userId, data] of Object.entries(userActivities)) {
            try {
                await UserDailySummary.findOneAndUpdate(
                    { userId: new mongoose.Types.ObjectId(userId), date: summaryDate },
                    {
                        userId: new mongoose.Types.ObjectId(userId),
                        date: summaryDate,
                        activities: data.activities,
                        stats: data.stats,
                    },
                    { upsert: true, new: true }
                );
                logger.info(
                    `[CRON] Saved summary for user ${userId}: ${data.activities.length} activities`
                );
            } catch (err) {
                logger.error(`[CRON] Failed to save summary for ${userId}: ${err.message}`);
            }
        }

        logger.info(
            `[CRON] Daily Summary completed: ${Object.keys(userActivities).length} users processed`
        );
    } catch (err) {
        logger.error(`[CRON] Daily Summary failed: ${err.message}`);
    }
}

// Schedule cron job - runs at 00:00 every day
export function startDailySummaryCron() {
    // "0 21 * * *" = At 21:00 UTC (00:00 TR time) every day
    cron.schedule("0 21 * * *", async () => {
        logger.info("[CRON] Daily Summary job started");
        await generateDailySummaries();
    });

    logger.info("[CRON] Daily Summary cron scheduled for 00:00 daily (21:00 UTC)");
}

// Export for manual testing
export { generateDailySummaries, UserDailySummary };
