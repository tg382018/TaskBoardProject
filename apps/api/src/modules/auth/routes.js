import { Router } from "express";
import {
  requestOtpController,
  verifyOtpController,
  refreshController,
  logoutController
} from "./controller.js";

export function authRoutes() {
  const router = Router();

  router.post("/otp/request", requestOtpController);
  router.post("/otp/verify", verifyOtpController);
  router.post("/refresh", refreshController);
  router.post("/logout", logoutController);

  return router;
}