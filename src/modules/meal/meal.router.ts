import express from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../shared";
import { mealController } from "./meal.controller";
// import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.get("/", mealController.getAllMeals);
router.post("/", auth(ROLES.PROVIDER), mealController.createMeal);
router.get("/:id", mealController.getMealById);
router.put("/:id", auth(ROLES.PROVIDER), mealController.updateMeal);

export const mealRouter = router;
