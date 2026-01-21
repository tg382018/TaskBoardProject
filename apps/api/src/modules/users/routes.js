import { Router } from "express";
import { getMeController, getSessionsController, logoutAllController } from "./controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

export function usersRoutes() {
    const router = Router();

    // Tüm user rotaları auth gerektirir
    router.use(authMiddleware);

    router.get("/me", getMeController);
    router.get("/sessions", getSessionsController);
    router.post("/logout-all", logoutAllController);

    return router;
}
