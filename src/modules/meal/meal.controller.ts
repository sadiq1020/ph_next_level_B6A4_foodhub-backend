import { Request, Response } from "express";
import { IMealFilters } from "./meal.interface";
import { mealService } from "./meal.service";
// import { mealService } from "./meal.service";

/*
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
*/

// create a meal (Provider only)
const createMeal = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await mealService.createMeal(req.body, user.id);

    res.status(201).json({
      success: true,
      message: "Meal created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Create Meal Failed",
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

// get meal by ID
const getMealById = async (req: Request, res: Response) => {
  try {
    const mealId = req.params.id;

    if (!mealId) {
      throw new Error("meal id is required");
    }

    const result = await mealService.getMealById(mealId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const mealController = {
  createMeal,
  getAllMeals,
  getMealById,
};
