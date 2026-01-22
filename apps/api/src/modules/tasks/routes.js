import { Router } from "express";
import {
    createTaskController,
    listTasksController,
    updateTaskController,
    deleteTaskController
} from "./controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { validateMiddleware } from "../../middlewares/validate.js";
import { createTaskSchema, updateTaskSchema } from "../../schemas/task.schema.js";

export function tasksRoutes() {
    const router = Router();

    router.use(authMiddleware);

    router.post("/", validateMiddleware(createTaskSchema), createTaskController);
    router.get("/", listTasksController);
    router.patch("/:id", validateMiddleware(updateTaskSchema), updateTaskController);
    router.delete("/:id", deleteTaskController);

    return router;
}
