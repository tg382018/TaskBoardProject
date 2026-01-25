import { Router } from "express";
import { broadcastEvent } from "../sockets/bridge.js";

/**
 * Internal API Routes
 * Only for service-to-service communication (Worker -> API)
 */

// 1- API ISTEGI ILE DB DEGISTI
//2- RABBITMQ BUNU EVENT OLARAK GONDERDI
//3- WORKER BUNU OKUR
//4-WORKER BU ENDPOINTI YOLLAYARAK OLAYI BROADCAST EDILMESINI SAGLAR
export function internalRoutes(_app) {
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
