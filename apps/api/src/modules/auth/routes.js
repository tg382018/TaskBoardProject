import { Router } from "express";
import {
  requestOtpController,
  verifyOtpController,
  refreshController,
  logoutController
} from "./controller.js";
import { validateMiddleware } from "../../middlewares/validate.js";
import { rateLimitMiddleware } from "../../middlewares/ratelimit.js";
import { otpRequestSchema, otpVerifySchema, refreshSchema } from "../../schemas/auth.schema.js";

export function authRoutes() {
  const router = Router();

  const otpRateLimit = rateLimitMiddleware({ windowMs: 5 * 60 * 1000, max: 5, keyPrefix: "rl:otp:" });
  // 1 kullanıcı 5 dk içinde max 5 kez ; her isteğin rediste tutulması
  router.post("/otp/request", otpRateLimit, validateMiddleware(otpRequestSchema), requestOtpController);
  router.post("/otp/verify", validateMiddleware(otpVerifySchema), verifyOtpController);
  router.post("/refresh", validateMiddleware(refreshSchema), refreshController);
  router.post("/logout", logoutController);

  return router;
}