import express from "express";
import { instructorController } from "./instructor.controller";

const router = express.Router();

// These are public — no auth needed
router.get("/", instructorController.getAllInstructors);
router.get("/:id", instructorController.getInstructorById);

export const instructorProfilesRouter = router;