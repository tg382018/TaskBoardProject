import * as repository from "./repository.js";
import { findProjectById } from "../projects/repository.js";
import { findCommentsByTaskId } from "../comments/repository.js";
import { publishEvent } from "../../events/publisher.js";

// Helper function for authorization check
function checkProjectAccess(project, userId) {
    const isOwner = String(project.ownerId?._id || project.ownerId) === String(userId);
    const isMember = project.members.some(m => String(m?._id || m) === String(userId));
    return isOwner || isMember;
}

export async function createNewTask(userId, data) {
    // Check if project exists and user is a member
    const project = await findProjectById(data.projectId);
    if (!project) throw new Error("Project not found");

    if (!checkProjectAccess(project, userId)) {
        throw new Error("Unauthorized: Not a member of this project");
    }

    // Strict Assignment Check
    if (data.assigneeId) {
        const isAssigneeMember = project.members.some(m => String(m?._id || m) === String(data.assigneeId));
        const isAssigneeOwner = String(project.ownerId?._id || project.ownerId) === String(data.assigneeId);
        if (!isAssigneeMember && !isAssigneeOwner) {
            throw new Error("Invalid Assignee: User must be a member of the project");
        }
    }

    const task = await repository.createTask({
        ...data,
        creatorId: userId,
    });

    // Trigger event
    await publishEvent("task.created", {
        type: "task.created",
        taskId: task._id,
        projectId: task.projectId,
        creatorId: userId,
        title: task.title,
    });

    return task;
}

export async function getProjectTasks(userId, projectId) {
    const project = await findProjectById(projectId);
    if (!project) throw new Error("Project not found");

    if (!checkProjectAccess(project, userId)) {
        throw new Error("Unauthorized");
    }

    return repository.findTasksByProjectId(projectId);
}

export async function getTaskById(userId, taskId) {
    const task = await repository.findTaskById(taskId);
    if (!task) throw new Error("Task not found");

    const project = await findProjectById(task.projectId);

    // Check if user has access to this project first
    if (!checkProjectAccess(project, userId)) {
        throw new Error("Unauthorized");
    }

    // Check task-level access: owner, task creator, or task assignee
    const isProjectOwner = String(project.ownerId?._id || project.ownerId) === String(userId);
    const isTaskCreator = String(task.creatorId?._id || task.creatorId) === String(userId);
    const isTaskAssignee = task.assigneeId && String(task.assigneeId?._id || task.assigneeId) === String(userId);

    if (!isProjectOwner && !isTaskCreator && !isTaskAssignee) {
        throw new Error("Owner has not authorized you for this task");
    }

    // Fetch comments for this task
    const comments = await findCommentsByTaskId(taskId);

    return { ...task.toObject(), comments };
}

export async function updateExistingTask(id, userId, data) {
    const task = await repository.findTaskById(id);
    if (!task) throw new Error("Task not found");

    const project = await findProjectById(task.projectId);
    if (!checkProjectAccess(project, userId)) {
        throw new Error("Unauthorized");
    }

    // Strict Assignment Check
    // Strict Assignment Check
    if (data.assigneeId) {
        // Redundant update check
        if (task.assigneeId && String(task.assigneeId) === String(data.assigneeId)) {
            // No changes needed for assignee
            delete data.assigneeId; // Avoid unnecessary processing
        } else {
            // Only Project Owner or Task Creator can change assignee
            // Note: task.creatorId might be populated, handle both cases
            const isProjectOwner = String(project.ownerId?._id || project.ownerId) === String(userId);
            const isTaskCreator = String(task.creatorId?._id || task.creatorId) === String(userId);

            if (!isProjectOwner && !isTaskCreator) {
                throw new Error("Unauthorized: Only task creator or project owner can assign members");
            }

            const isAssigneeMember = project.members.some(m => String(m?._id || m) === String(data.assigneeId));
            const isAssigneeOwner = String(project.ownerId?._id || project.ownerId) === String(data.assigneeId);
            if (!isAssigneeMember && !isAssigneeOwner && data.assigneeId !== null) {
                throw new Error("Invalid Assignee: User must be a member of the project");
            }
        }
    }

    const updated = await repository.updateTask(id, data);

    // Trigger event
    await publishEvent("task.updated", {
        type: "task.updated",
        taskId: updated._id,
        projectId: updated.projectId,
        updatedBy: userId,
        changes: data,
    });

    return updated;
}

export async function removeTask(id, userId) {
    const task = await repository.findTaskById(id);
    if (!task) throw new Error("Task not found");

    const project = await findProjectById(task.projectId);

    // Check if user is the project owner
    const isProjectOwner = String(project.ownerId?._id || project.ownerId) === String(userId);

    if (!isProjectOwner) {
        throw new Error("Unauthorized: Only project owner can delete tasks");
    }

    await repository.deleteTask(id);

    // Trigger event
    await publishEvent("task.deleted", {
        type: "task.deleted",
        taskId: id,
        projectId: task.projectId,
        deletedBy: userId,
    });

    return true;
}
