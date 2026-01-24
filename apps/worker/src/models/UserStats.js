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

// Static method to increment a stat for a user
userStatsSchema.statics.incrementStat = async function (userId, statName, incrementBy = 1) {
    return this.findOneAndUpdate(
        { userId },
        { $inc: { [statName]: incrementBy } },
        { upsert: true, new: true }
    );
};

// Static method to get stats for a user
userStatsSchema.statics.getByUserId = async function (userId) {
    let stats = await this.findOne({ userId });
    if (!stats) {
        stats = await this.create({ userId });
    }
    return stats;
};

export const UserStats = mongoose.model("UserStats", userStatsSchema);
