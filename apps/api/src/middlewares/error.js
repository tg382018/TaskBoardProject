import { logger } from "../utils/logger.js";

export function notFound(req, res) {
    res.status(404).json({ error: "Not Found" });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
    logger.error(err);
    res.status(500).json({ error: "Internal Server Error" });
}
