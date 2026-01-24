import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },
        projectsCreated: {
            type: Number,
            default: 0,
        },
        projectsDeleted: {
            type: Number,
            default: 0,
        },
        tasksCreated: {
            type: Number,
            default: 0,
        },
        tasksDeleted: {
            type: Number,
            default: 0,
        },
        tasksAssigned: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const UserStats = mongoose.model("UserStats", userStatsSchema);
