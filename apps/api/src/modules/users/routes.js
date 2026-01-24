import { Router } from "express";
import {
    getMeController,
    getSessionsController,
    logoutAllController,
    updateProfileController,
    getDailySummaryController,
} from "./controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { validateMiddleware } from "../../middlewares/validate.js";
import { updateUserSchema, changePasswordSchema } from "@packages/common/schemas/user.schema.js";

export function usersRoutes() {
    const router = Router();

    // Tüm user rotaları auth gerektirir
    router.use(authMiddleware);

    router.get("/me", getMeController);
    router.patch("/me", validateMiddleware(updateUserSchema), updateProfileController);
    router.get("/sessions", getSessionsController);
    router.post("/logout-all", logoutAllController);
    router.get("/daily-summary", getDailySummaryController);

    return router;
}
