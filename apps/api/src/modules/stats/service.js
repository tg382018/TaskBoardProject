import { UserStats } from "./repository.js";

export async function getMyStats(userId) {
    const stats = await UserStats.findOne({ userId });

    if (!stats) {
        // Return empty stats if user has no activity yet
        return {
            projectsCreated: 0,
            projectsDeleted: 0,
            tasksCreated: 0,
            tasksDeleted: 0,
            tasksAssigned: 0,
        };
    }

    return {
        projectsCreated: stats.projectsCreated,
        projectsDeleted: stats.projectsDeleted,
        tasksCreated: stats.tasksCreated,
        tasksDeleted: stats.tasksDeleted,
        tasksAssigned: stats.tasksAssigned,
    };
}
