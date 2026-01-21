import * as service from "./service.js";

export async function getCommentsController(req, res, next) {
    try {
        const comments = await service.listTaskComments(req.query.taskId);
        res.json(comments);
    } catch (err) {
        next(err);
    }
}

export async function addCommentController(req, res, next) {
    try {
        const comment = await service.addComment({
            ...req.body,
            authorId: req.user?.sub
        });
        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
}
