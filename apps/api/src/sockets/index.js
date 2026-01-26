import { logger } from "../utils/logger.js";
import { joinProjectRoom, leaveProjectRoom, ROOMS } from "./rooms.js";

/**
 * Realtime Namespace setup
 
 */
export function setupRealtimeNamespace(io) {
    const realtime = io.of("/realtime"); //realtime tagi ile duyurulur

    realtime.on("connection", (socket) => {
        //oluşturulan realtime a bağlanır
        if (!socket.user) {
            //tekrardan auth kontrolü yapılıyor
            logger.warn(`[socket] connection without user, disconnecting ${socket.id}`);
            return socket.disconnect();
        }

        logger.info(`[socket] user connected: ${socket.user.email} (${socket.id})`);

        // Join global user room for private notifications
        //her kullanıcının kendi odası var
        socket.join(ROOMS.USER(socket.user._id));

        // Subscribing to a project
        //kullanıcı bir projeye girdiğinde
        socket.on("project:join", (projectId) => {
            joinProjectRoom(socket, projectId);
            logger.debug(`[socket] user ${socket.user.email} joined project:${projectId}`);
        });
        //kullanıcı bir projeden ayrıldığında(ekranı kapattığında)
        socket.on("project:leave", (projectId) => {
            leaveProjectRoom(socket, projectId);
            logger.debug(`[socket] user ${socket.user.email} left project:${projectId}`);
        });

        //kullanıcı disconnet olursa
        socket.on("disconnect", () => {
            if (socket.user) {
                logger.info(`[socket] user disconnected: ${socket.user.email}`);
            }
        });
    });

    // Attach to io for global access if needed
    io.realtime = realtime;
}
