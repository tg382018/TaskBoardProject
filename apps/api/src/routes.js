import { Router } from "express";
import { authRoutes } from "./modules/auth/routes.js";
import { usersRoutes } from "./modules/users/routes.js";
import { projectsRoutes } from "./modules/projects/routes.js";
import { tasksRoutes } from "./modules/tasks/routes.js";
import { commentsRoutes } from "./modules/comments/routes.js";
import statsRoutes from "./modules/stats/routes.js";

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
    router.use("/projects", projectsRoutes());
    router.use("/tasks", tasksRoutes());
    router.use("/comments", commentsRoutes());
    router.use("/stats", statsRoutes);

    return router;
}
