import * as repository from "./repository.js";
import { findTaskById } from "../tasks/repository.js";
import { publishEvent } from "../../events/publisher.js";

export async function addCommentToTask(userId, { content, taskId }) {
    const task = await findTaskById(taskId);
    if (!task) throw new Error("Task not found");

    const comment = await repository.createComment({
        content,
        taskId,
        authorId: userId,
    });

    await publishEvent("comment.added", {
        type: "comment.added",
        commentId: comment._id,
        taskId,
        projectId: task.projectId,
        authorId: userId,
        content: content.substring(0, 50),
    });

    return comment;
}

export async function getTaskComments(taskId) {
    return repository.findCommentsByTaskId(taskId);
}
