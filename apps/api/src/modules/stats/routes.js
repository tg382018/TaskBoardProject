import { Router } from "express";
import { getMyStatsController } from "./controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = Router();

// GET /api/stats/me - Get current user's statistics
router.get("/me", authMiddleware, getMyStatsController);

export default router;
