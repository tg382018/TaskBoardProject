import { Router } from "express";
import { authRoutes } from "./modules/auth/routes.js";
import { usersRoutes } from "./modules/users/routes.js";

/**
 * Main router
 
 */
export function buildRoutes() {
    const router = Router();

    router.get("/health", (req, res) => {
        res.json({ ok: true });
    });

    router.use("/auth", authRoutes());
    router.use("/users", usersRoutes());

    return router;
}