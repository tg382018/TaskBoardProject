import { Router } from "express";
import { authRoutes } from "./modules/auth/routes.js";
import { usersRoutes } from "./modules/users/routes.js";
import { projectsRoutes } from "./modules/projects/routes.js";
import { tasksRoutes } from "./modules/tasks/routes.js";

/**
 * Main router
 * Ref: aa.txt line 23 & 16
 */
export function buildRoutes() {
    const router = Router();

    router.get("/health", (req, res) => {
        res.json({ ok: true });
    });

    router.use("/auth", authRoutes());
    router.use("/users", usersRoutes());
    router.use("/projects", projectsRoutes());
    router.use("/tasks", tasksRoutes());

    return router;
}