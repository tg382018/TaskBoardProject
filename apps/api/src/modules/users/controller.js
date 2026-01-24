import * as service from "./service.js";

export async function getMeController(req, res, next) {
    try {
        const user = await service.getMe(req.user._id);
        res.json(user);
    } catch (err) {
        next(err);
    }
}

export async function getSessionsController(req, res, next) {
    try {
        const sessions = await service.getUserSessions(req.user._id);
        res.json(sessions);
    } catch (err) {
        next(err);
    }
}

export async function logoutAllController(req, res, next) {
    try {
        await service.clearAllSessions(req.user._id);
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
}

export async function updateProfileController(req, res, next) {
    try {
        const user = await service.updateUserProfile(req.user._id, req.body);
        res.json(user);
    } catch (err) {
        next(err);
    }
}

// Get user's daily activity summary
import mongoose from "mongoose";

const UserDailySummary =
    mongoose.models.UserDailySummary ||
    mongoose.model(
        "UserDailySummary",
        new mongoose.Schema({
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
            date: { type: Date, index: true },
            activities: [
                {
                    type: String,
                    message: String,
                    projectName: String,
                    taskTitle: String,
                    timestamp: Date,
                },
            ],
            stats: {
                tasksCreated: Number,
                tasksUpdated: Number,
                commentsAdded: Number,
                projectsJoined: Number,
            },
            createdAt: Date,
        })
    );

export async function getDailySummaryController(req, res, next) {
    try {
        const userId = req.user._id;

        // Get summaries for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const summaries = await UserDailySummary.find({
            userId,
            date: { $gte: sevenDaysAgo },
        })
            .sort({ date: -1 })
            .lean();

        res.json(summaries);
    } catch (err) {
        next(err);
    }
}
