import pino from "pino";
import { config } from "../config/env.js";

const isDevelopment = config.env === "development";

export const logger = pino({
    level: process.env.LOG_LEVEL || "debug",
    transport: isDevelopment
        ? {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
            },
        }
        : undefined,
});

/**
 * Aligning with previous helper structure if needed, 
 * but pino already provides info, warn, error, debug.
 * We can export it directly or wrap it.
 */
