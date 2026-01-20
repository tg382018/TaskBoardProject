import { Router } from "express";

export function buildRoutes() {
    const router = Router();

    router.get("/health", (req, res) => {
        res.json({ ok: true });
    });

    return router;
}
