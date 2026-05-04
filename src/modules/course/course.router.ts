import express from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../shared";
import { courseController } from "./course.controller";

const router = express.Router();

// ── Specific routes MUST come before /:id ─────────────
router.get("/my-courses", auth(ROLES.INSTRUCTOR), courseController.getMyCourses);

// ── Public routes ──────────────────────────────────────
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);

// ── Instructor only routes ─────────────────────────────
router.post("/", auth(ROLES.INSTRUCTOR), courseController.createCourse);
router.put("/:id", auth(ROLES.INSTRUCTOR), courseController.updateCourse);
router.delete("/:id", auth(ROLES.INSTRUCTOR), courseController.deleteCourse);

export const courseRouter = router;