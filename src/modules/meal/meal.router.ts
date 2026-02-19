import express from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../shared";
import { mealController } from "./meal.controller";
// import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.get("/my-meals", auth(ROLES.PROVIDER), mealController.getMyMeals);
router.get("/", mealController.getAllMeals);
router.post("/", auth(ROLES.PROVIDER), mealController.createMeal); // ok
router.get("/:id", mealController.getMealById);
router.put("/:id", auth(ROLES.PROVIDER), mealController.updateMeal); // ok
router.delete("/:id", auth(ROLES.PROVIDER), mealController.deleteMeal); // ok

export const mealRouter = router;
