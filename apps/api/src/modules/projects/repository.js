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

export async function findProjectsByUserId(userId, {
    skip = 0,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc"
} = {}) {
    // Base query: User must be owner OR member
    const baseQuery = { $or: [{ ownerId: userId }, { members: userId }] };

    let finalQuery = baseQuery;

    // Server-side search (user access AND (title match OR description match))
    if (search) {
        finalQuery = {
            $and: [
                baseQuery,
                {
                    $or: [
                        { title: { $regex: search, $options: "i" } },
                        { description: { $regex: search, $options: "i" } }
                    ]
                }
            ]
        };
    }

    // Dynamic sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [data, total] = await Promise.all([
        Project.find(finalQuery)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .populate("ownerId", "email name"),
        Project.countDocuments(finalQuery)
    ]);

    // Debug logging
    console.log("[DEBUG] findProjectsByUserId", { search, finalQuery: JSON.stringify(finalQuery), total, dataCount: data.length });

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
