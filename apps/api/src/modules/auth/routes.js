import { Router } from "express";
import {
  registerController,
  loginController,
  verifyOtpController,
  refreshController,
  logoutController,
  getSessionsController,
  revokeSessionController
} from "./controller.js";
import { validateMiddleware } from "../../middlewares/validate.js";
import { rateLimitMiddleware } from "../../middlewares/ratelimit.js";
import { registerSchema, loginSchema, otpVerifySchema, refreshSchema } from "../../schemas/auth.schema.js";
import { authMiddleware } from "../../middlewares/auth.js";

export function authRoutes() {
  const router = Router();

  const otpRateLimit = rateLimitMiddleware({ windowMs: 5 * 60 * 1000, max: 5, keyPrefix: "rl:otp:" });

  router.post("/register", otpRateLimit, validateMiddleware(registerSchema), registerController);
  router.post("/login", otpRateLimit, validateMiddleware(loginSchema), loginController);
  router.post("/verify", validateMiddleware(otpVerifySchema), verifyOtpController);
  router.post("/refresh", validateMiddleware(refreshSchema), refreshController);
  router.post("/logout", logoutController);

  // Sessions Management
  router.get("/sessions", authMiddleware, getSessionsController);
  router.delete("/sessions/:id", authMiddleware, revokeSessionController);

  return router;
}