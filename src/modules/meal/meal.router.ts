import express from "express";
import { mealController } from "./meal.controller";
// import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.post("/", mealController.createMeal);
router.get("/", mealController.getAllMeals);

export const mealRouter = router;
