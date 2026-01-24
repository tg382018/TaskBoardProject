import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);

export async function createComment(data) {
    return (await Comment.create(data)).populate("authorId", "email");
}

export async function findCommentsByTaskId(taskId) {
    return Comment.find({ taskId }).populate("authorId", "email").sort({ createdAt: 1 });
}
