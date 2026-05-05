import express from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../shared";
import { adminController } from "./admin.controller";

const router = express.Router();

// All admin routes are protected — ADMIN role required
router.get("/stats", auth(ROLES.ADMIN), adminController.getStats);

// Chart data endpoints
router.get("/charts/enrollment-trend", auth(ROLES.ADMIN), adminController.getEnrollmentTrend);
router.get("/charts/revenue", auth(ROLES.ADMIN), adminController.getRevenueByMonth);
router.get("/charts/user-roles", auth(ROLES.ADMIN), adminController.getUserRoleDistribution);

// Instructor application management
router.get(
  "/instructors",
  auth(ROLES.ADMIN),
  adminController.getAllInstructorApplications,
);

router.patch(
  "/instructors/:id/approve",
  auth(ROLES.ADMIN),
  adminController.approveInstructor,
);

router.patch(
  "/instructors/:id/reject",
  auth(ROLES.ADMIN),
  adminController.rejectInstructor,
);

export const adminRouter = router;