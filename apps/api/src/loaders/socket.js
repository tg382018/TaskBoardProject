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

    // Get the /realtime namespace
    const realtimeNs = io.of("/realtime");

    // Auth Middleware for /realtime namespace
    realtimeNs.use(async (socket, next) => {
        try {
            const token =
                socket.handshake.auth?.token || //token
                socket.handshake.headers?.authorization?.split(" ")[1]; //http

            if (!token) {
                logger.warn("[socket] Auth failed: Token missing");
                return next(new Error("Authentication error: Token missing"));
            }

            const decoded = verifyAccessToken(token);
            if (!decoded) {
                logger.warn("[socket] Auth failed: Invalid or expired token");
                return next(new Error("Authentication error: Invalid or expired token"));
            }

            socket.user = {
                _id: decoded.id || decoded.sub,
                email: decoded.email,
                role: decoded.role,
            };
            logger.debug(`[socket] Auth success: ${decoded.email}`);
            next();
        } catch (err) {
            logger.error("[socket] auth failed", err.message);
            next(new Error("Authentication error: Invalid token"));
        }
    });

    // Setup Namespace handlers
    setupRealtimeNamespace(io);

    logger.info("[socket] loader initialized");
    return io;
}
