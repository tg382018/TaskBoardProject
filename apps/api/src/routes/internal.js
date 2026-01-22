import { Router } from "express";
import { broadcastEvent } from "../sockets/bridge.js";

/**
 * Internal API Routes
 * Only for service-to-service communication (Worker -> API)
 */
export function internalRoutes(app) {
    const router = Router();

    router.post("/broadcast", (req, res) => {
        const io = req.app.get("io");
        if (!io) {
            console.error("[bridge] Socket.io not found in app settings");
            return res.status(500).json({ error: "Socket.io not initialized" });
        }

        broadcastEvent(io, req.body);
        res.json({ ok: true });
    });

    return router;
}
