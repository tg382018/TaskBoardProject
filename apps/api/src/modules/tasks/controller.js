import * as service from "./service.js";

export async function createTaskController(req, res, next) {
    try {
        const task = await service.createNewTask(req.user._id, req.body);
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
}

import { getPagination } from "../../utils/pagination.js";

export async function listTasksController(req, res, next) {
    try {
        const { projectId } = req.query;
        if (!projectId) return res.status(400).json({ error: "projectId is required" });

        const { page, limit, skip } = getPagination(req.query);
        const tasks = await service.getProjectTasks(req.user._id, projectId, { page, limit, skip });
        res.json(tasks);
    } catch (err) {
        next(err);
    }
}

export async function getTaskController(req, res, next) {
    try {
        const task = await service.getTaskById(req.user._id, req.params.id);
        res.json(task);
    } catch (err) {
        next(err);
    }
}

export async function updateTaskController(req, res, next) {
    try {
        const task = await service.updateExistingTask(req.params.id, req.user._id, req.body);
        res.json(task);
    } catch (err) {
        next(err);
    }
}

export async function deleteTaskController(req, res, next) {
    try {
        await service.removeTask(req.params.id, req.user._id);
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
}
