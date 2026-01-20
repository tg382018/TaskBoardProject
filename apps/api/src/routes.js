// routes.js
import { Router } from "express";
import { debugRoutes } from "./modules/debug/debug.routes.js";
import { authRoutes } from "./modules/auth/routes.js";  // << EKLE

export function buildRoutes() {
    const router = Router();

    router.get("/health", (req, res) => {
        res.json({ ok: true });
    });
    router.use("/debug", debugRoutes());
    router.use("/auth", authRoutes());  
    return router;
}