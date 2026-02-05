import express from "express";
import { mealController } from "./meal.controller";
// import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.get("/", mealController.getAllMeals);
router.post("/", mealController.createMeal);
router.get("/:id", mealController.getMealById);

export const mealRouter = router;
