import * as statsService from "./service.js";

export async function getMyStatsController(req, res, next) {
    try {
        const stats = await statsService.getMyStats(req.user._id);
        res.json(stats);
    } catch (err) {
        next(err);
    }
}
