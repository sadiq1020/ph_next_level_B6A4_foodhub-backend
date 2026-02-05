import { Request, Response } from "express";
import { mealService } from "./meal .service";
import { IMealFilters } from "./meal.interface";
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

// get all meals with filters (public)
const getAllMeals = async (req: Request, res: Response) => {
  try {
    // Build filters from query params
    // All are optional — if not provided, that filter is skipped
    const filters: IMealFilters = {
      categoryId: req.query.categoryId as string | undefined,
      dietary: req.query.dietary as string | undefined,
      providerId: req.query.providerId as string | undefined,
      search: req.query.search as string | undefined,

      // Convert price strings to numbers (query params are always strings)
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    };

    const result = await mealService.getAllMeals(filters);
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
