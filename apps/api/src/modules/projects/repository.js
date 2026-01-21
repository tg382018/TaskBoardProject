import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
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
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);

export async function createProject(data) {
    return Project.create(data);
}

export async function findProjectsByUserId(userId) {
    return Project.find({
        $or: [{ ownerId: userId }, { members: userId }],
    }).sort({ createdAt: -1 });
}

export async function findProjectById(id) {
    return Project.findById(id);
}

export async function updateProject(id, userId, data) {
    return Project.findOneAndUpdate(
        { _id: id, ownerId: userId },
        { $set: data },
        { new: true }
    );
}

export async function deleteProject(id, userId) {
    return Project.findOneAndDelete({ _id: id, ownerId: userId });
}
