import express from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../shared";
import { instructorController } from "./instructor.controller";

const router = express.Router();

// POST /instructor/profile
// No role guard here — any logged-in user can apply to become an instructor.
// The service promotes their role to INSTRUCTOR atomically.
router.post("/profile", auth(), instructorController.createInstructorProfile);

// GET /instructor/profile
router.get(
  "/profile",
  auth(ROLES.INSTRUCTOR),
  instructorController.getMyProfile,
);

// PUT /instructor/profile
router.put(
  "/profile",
  auth(ROLES.INSTRUCTOR),
  instructorController.updateMyProfile,
);

// GET /instructor/orders  (enrollments for my courses)
router.get(
  "/orders",
  auth(ROLES.INSTRUCTOR),
  instructorController.getMyOrders,
);

export const instructorRouter = router;