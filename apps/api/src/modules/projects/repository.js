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

export async function findProjectsByUserId(userId, { skip = 0, limit = 10 } = {}) {
    const query = { $or: [{ ownerId: userId }, { members: userId }] };

    const [data, total] = await Promise.all([
        Project.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("ownerId", "email name"),
        Project.countDocuments(query)
    ]);

    return { data, total };
}

export async function findProjectById(id) {
    return Project.findById(id)
        .populate("ownerId", "email name")
        .populate("members", "email name");
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

export async function addMemberToProject(id, memberId) {
    return Project.findByIdAndUpdate(
        id,
        { $addToSet: { members: memberId } },
        { new: true }
    );
}
