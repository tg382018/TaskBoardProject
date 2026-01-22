import { logger } from "../utils/logger.js";
import { joinProjectRoom, leaveProjectRoom, ROOMS } from "./rooms.js";

/**
 * Realtime Namespace setup
 
 */
export function setupRealtimeNamespace(io) {
    const realtime = io.of("/realtime");

    realtime.on("connection", (socket) => {
        logger.info(`[socket] user connected: ${socket.user.email} (${socket.id})`);

        // Join global user room for private notifications
        socket.join(ROOMS.USER(socket.user._id));

        // Subscribing to a project
        socket.on("project:join", (projectId) => {
            joinProjectRoom(socket, projectId);
            logger.debug(`[socket] user ${socket.user.email} joined project:${projectId}`);
        });

        socket.on("project:leave", (projectId) => {
            leaveProjectRoom(socket, projectId);
            logger.debug(`[socket] user ${socket.user.email} left project:${projectId}`);
        });

        socket.on("disconnect", () => {
            logger.info(`[socket] user disconnected: ${socket.user.email}`);
        });
    });

    // Attach to io for global access if needed
    io.realtime = realtime;
}
