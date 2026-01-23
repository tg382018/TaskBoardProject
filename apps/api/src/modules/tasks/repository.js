import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Todo", "InProgress", "Done"],
            default: "Todo",
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        assigneeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);

export async function createTask(data) {
    return Task.create(data);
}

export async function findTasksByProjectId(projectId, { skip = 0, limit = 10 } = {}) {
    const query = { projectId };
    const [data, total] = await Promise.all([
        Task.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Task.countDocuments(query)
    ]);
    return { data, total };
}

export async function findTaskById(id) {
    return Task.findById(id).populate("assigneeId creatorId");
}

export async function updateTask(id, data) {
    return Task.findByIdAndUpdate(id, { $set: data }, { new: true });
}

export async function deleteTask(id) {
    return Task.findByIdAndDelete(id);
}
