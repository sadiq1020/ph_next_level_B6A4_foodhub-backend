import { Request, Response } from "express";
import { mealService } from "./meal .service";
// import { mealService } from "./meal.service";

// create a meal
const createMeal = async (req: Request, res: Response) => {
  try {
    const result = await mealService.createMeal(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Create Meal Failed",
      details: err,
    });
  }
};

// get all meals (public)
const getAllMeals = async (req: Request, res: Response) => {
  try {
    const result = await mealService.getAllMeals();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Get All Meals Failed",
      details: err,
    });
  }
};

export const mealController = {
  createMeal,
  getAllMeals,
};
