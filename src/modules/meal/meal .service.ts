import { prisma } from "../../lib/prisma"
import { ICreateMeal } from "./meal.interface"

const createMeal = async (data: ICreateMeal) => {
    const result = await prisma.meal.create({
        data
    })
    return result;
}

export const mealService = {
    createMeal
}