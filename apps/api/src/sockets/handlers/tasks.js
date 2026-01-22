import { ROOMS } from "../rooms.js";
import { logger } from "../../utils/logger.js";

/**
 * Task Socket Handlers
 * Ref: aa.txt -> sockets/handlers/tasks.js
 */
export function handleTaskEvent(io, payload) {
    const { type, projectId } = payload;

    if (projectId) {
        logger.debug(`[socket:tasks] Emitting ${type} to project:${projectId}`);
        io.of("/realtime").to(ROOMS.PROJECT(projectId)).emit(type, payload);
    }
}
