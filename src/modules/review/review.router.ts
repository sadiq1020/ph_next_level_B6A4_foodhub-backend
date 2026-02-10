import express from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../shared";
import { reviewController } from "./review.controller";

const router = express.Router();

// Customer routes
router.post("/", auth(ROLES.CUSTOMER), reviewController.createReview);

export const reviewRouter = router;
