import * as repository from "./repository.js";
import { findProjectById } from "../projects/repository.js";
import { publishEvent } from "../../events/publisher.js";

export async function createNewTask(userId, data) {
    // Check if project exists and user is a member
    const project = await findProjectById(data.projectId);
    if (!project) throw new Error("Project not found");

    if (!project.members.includes(userId) && String(project.ownerId) !== String(userId)) {
        throw new Error("Unauthorized: Not a member of this project");
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

    if (!project.members.includes(userId) && String(project.ownerId) !== String(userId)) {
        throw new Error("Unauthorized");
    }

    return repository.findTasksByProjectId(projectId);
}

export async function updateExistingTask(id, userId, data) {
    const task = await repository.findTaskById(id);
    if (!task) throw new Error("Task not found");

    const project = await findProjectById(task.projectId);
    if (!project.members.includes(userId) && String(project.ownerId) !== String(userId)) {
        throw new Error("Unauthorized");
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
    if (!project.members.includes(userId) && String(project.ownerId) !== String(userId)) {
        throw new Error("Unauthorized");
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
