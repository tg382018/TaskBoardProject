import { Router } from "express";
import { getMeController, getSessionsController, logoutAllController, updateProfileController } from "./controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { validateMiddleware } from "../../middlewares/validate.js";
import { updateProfileSchema } from "../../schemas/user.schema.js";

export function usersRoutes() {
    const router = Router();

    // Tüm user rotaları auth gerektirir
    router.use(authMiddleware); //JWT DOGRULAMA

    router.get("/me", getMeController);
    router.patch("/me", validateMiddleware(updateProfileSchema), updateProfileController);
    router.get("/sessions", getSessionsController);
    router.post("/logout-all", logoutAllController);

    return router;
}
