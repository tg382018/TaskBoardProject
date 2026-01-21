import { Router } from "express";
import * as controller from "./controller.js";

export function commentRoutes() {
  const router = Router();

  router.get("/", controller.getCommentsController);
  router.post("/", controller.addCommentController);

  return router;
}
