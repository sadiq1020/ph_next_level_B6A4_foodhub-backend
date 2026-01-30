import { NextFunction, Request, Response } from "express";
import { mealService } from "./meal .service";

const createMeal = async (req: Request, res: Response) => {
    try {
        const result = await mealService.createMeal(req.body)
        res.status(201).json(result)
    } catch (err) {
        res.status(400).json({
            error: "Post Creating Failed",
            details: err
        })
    }
}

export const mealController = {
    createMeal
}