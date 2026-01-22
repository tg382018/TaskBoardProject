import * as service from "./service.js";

export async function getMeController(req, res, next) {
    try {
        const user = await service.getMe(req.user._id);
        res.json(user);
    } catch (err) {
        next(err);
    }
}

export async function getSessionsController(req, res, next) {
    try {
        const sessions = await service.getUserSessions(req.user._id);
        res.json(sessions);
    } catch (err) {
        next(err);
    }
}

export async function logoutAllController(req, res, next) {
    try {
        await service.clearAllSessions(req.user._id);
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
}

export async function updateProfileController(req, res, next) {
    try {
        const user = await service.updateUserProfile(req.user._id, req.body);
        res.json(user);
    } catch (err) {
        next(err);
    }
}
