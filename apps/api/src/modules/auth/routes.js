import { Router } from "express";
import {
  registerController,
  loginController,
  verifyOtpController,
  refreshController,
  logoutController,
  getSessionsController,
  revokeSessionController,
  resendOtpController,
  getDevOtpController
} from "./controller.js";
import { validateMiddleware } from "../../middlewares/validate.js";
import { rateLimitMiddleware } from "../../middlewares/ratelimit.js";
import { registerSchema, loginSchema, otpVerifySchema, refreshSchema, resendOtpSchema } from "../../schemas/auth.schema.js";
import { authMiddleware } from "../../middlewares/auth.js";

export function authRoutes() {
  const router = Router();

  const otpRateLimit = rateLimitMiddleware({ windowMs: 5 * 60 * 1000, max: 5, keyPrefix: "rl:otp:" });

  router.post("/register", otpRateLimit, validateMiddleware(registerSchema), registerController);
  router.post("/login", otpRateLimit, validateMiddleware(loginSchema), loginController);
  router.post("/resend", otpRateLimit, validateMiddleware(resendOtpSchema), resendOtpController);
  router.post("/verify", validateMiddleware(otpVerifySchema), verifyOtpController);
  router.post("/refresh", validateMiddleware(refreshSchema), refreshController);
  router.post("/logout", logoutController);

  // Sessions Management
  router.get("/sessions", authMiddleware, getSessionsController);
  router.delete("/sessions/:id", authMiddleware, revokeSessionController);

  // Development-only: Peek at OTP for console notification
  router.get("/dev/otp/:email", getDevOtpController);

  return router;
}