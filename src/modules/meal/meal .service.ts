import { prisma } from "../../lib/prisma";
import { ICreateMeal } from "./meal.interface";

// create a meal
const createMeal = async (data: ICreateMeal) => {
  const result = await prisma.meal.create({
    data,
  });
  return result;
};

// get all meals
const getAllMeals = async () => {
  const result = await prisma.meal.findMany();
  return result;
};

export const mealService = {
  createMeal,
  getAllMeals,
};
