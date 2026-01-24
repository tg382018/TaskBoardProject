import * as service from "./service.js";

export async function createCommentController(req, res, next) {
    try {
        const comment = await service.addCommentToTask(req.user._id, req.body);
        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
}

export async function listCommentsController(req, res, next) {
    try {
        const { taskId } = req.query;
        if (!taskId) return res.status(400).json({ error: "taskId is required" });

        const comments = await service.getTaskComments(taskId);
        res.json(comments);
    } catch (err) {
        next(err);
    }
}
