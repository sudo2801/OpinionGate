import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createFeedback, deleteFeedback, getFeedback } from "../controllers/feedback.controller.js";

const router = Router();

// secured routes

router.route("/create").post(verifyJWT, createFeedback);
router.route("/all").get(verifyJWT, getFeedback);
router.route("/delete").delete  (verifyJWT, deleteFeedback);

export default router;
