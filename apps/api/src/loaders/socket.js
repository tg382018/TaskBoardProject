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
            // Try to get token from: auth object, authorization header, or cookies
            let token =
                socket.handshake.auth?.token ||
                socket.handshake.headers?.authorization?.split(" ")[1];

            // If no token found, try to parse from cookies
            if (!token && socket.handshake.headers?.cookie) {
                const cookies = socket.handshake.headers.cookie.split(";");
                for (const cookie of cookies) {
                    const [name, value] = cookie.trim().split("=");
                    if (name === "accessToken") {
                        token = value;
                        break;
                    }
                }
            }

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
