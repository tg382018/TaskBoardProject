import { Router } from "express";
import { debugRoutes } from "./modules/debug/debug.routes.js";
export function buildRoutes() {
    const router = Router();

    router.get("/health", (req, res) => {
        res.json({ ok: true });
    });
    router.use("/debug", debugRoutes());
    return router;
}
