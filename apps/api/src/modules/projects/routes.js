import { Router } from "express";
import {
    createProjectController,
    listProjectsController,
    getProjectController,
    updateProjectController,
    deleteProjectController
} from "./controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { validateMiddleware } from "../../middlewares/validate.js";
import { createProjectSchema, updateProjectSchema } from "../../schemas/project.schema.js";

export function projectsRoutes() {
    const router = Router();

    router.use(authMiddleware);

    router.post("/", validateMiddleware(createProjectSchema), createProjectController);
    router.get("/", listProjectsController);
    router.get("/:id", getProjectController);
    router.patch("/:id", validateMiddleware(updateProjectSchema), updateProjectController);
    router.delete("/:id", deleteProjectController);

    return router;
}
