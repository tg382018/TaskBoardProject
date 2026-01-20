
import { Router } from "express";
import { requestOtpController, verifyOtpController } from "./controller.js";

export function authRoutes() {
  const router = Router();

  router.post("/otp/request", requestOtpController);
  router.post("/otp/verify", verifyOtpController);

  return router;
}