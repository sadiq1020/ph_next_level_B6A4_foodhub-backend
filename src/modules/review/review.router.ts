import express from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../shared";
import { reviewController } from "./review.controller";

const router = express.Router();

// GET /reviews/top — Public (no auth) — for home page testimonials
// Must be defined before /:id to avoid route collision
router.get("/top", reviewController.getTopReviews);

// Customer routes
router.post("/", auth(ROLES.CUSTOMER), reviewController.createReview);

export const reviewRouter = router;
