import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            index: true,
        },
        payload: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        processedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false,
        versionKey: false
    }
);

export const EventLog = mongoose.model("EventLog", eventSchema);
