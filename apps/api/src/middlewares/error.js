import { logger } from "../utils/logger.js";

export function notFound(req, res) {
    res.status(404).json({ error: "Not Found" });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
    logger.error(err);

    const message = err.message || "Internal Server Error";

    // Determine status code based on error message
    let statusCode = 500;
    if (message.includes("Unauthorized") || message.includes("authorized") || message.includes("access")) {
        statusCode = 403;
    } else if (message.includes("not found") || message.includes("Not found")) {
        statusCode = 404;
    } else if (message.includes("Invalid") || message.includes("required")) {
        statusCode = 400;
    }

    res.status(statusCode).json({ error: message, message: message });
}
