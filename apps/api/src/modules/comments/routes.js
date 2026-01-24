import { Router } from "express";
import { createCommentController, listCommentsController } from "./controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { validateMiddleware } from "../../middlewares/validate.js";
import { createCommentSchema } from "@packages/common/schemas/comment.schema.js";

export function commentsRoutes() {
    const router = Router();

    router.use(authMiddleware);

    router.post("/", validateMiddleware(createCommentSchema), createCommentController);
    router.get("/", listCommentsController);

    return router;
}
