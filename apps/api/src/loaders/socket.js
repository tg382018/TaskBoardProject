import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.js";
import { setupRealtimeNamespace } from "../sockets/index.js";
import { logger } from "../utils/logger.js";

/**
 * Socket.io Loader
 
 */
export function loadSocket(server, { corsOrigins }) {
    const io = new Server(server, {
        cors: {
            origin: corsOrigins,
            credentials: true,
        },
    });

    // Auth Middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];

            if (!token) {
                return next(new Error("Authentication error: Token missing"));
            }

            const decoded = verifyAccessToken(token);
            socket.user = { _id: decoded.sub, email: decoded.email, role: decoded.role };
            next();
        } catch (err) {
            logger.error("[socket] auth failed", err.message);
            next(new Error("Authentication error: Invalid token"));
        }
    });

    // Setup Namespace
    setupRealtimeNamespace(io);

    logger.info("[socket] loader initialized");
    return io;
}
