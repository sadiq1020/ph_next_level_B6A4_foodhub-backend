import { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";


// create new category
const createCategory = async (req: Request, res: Response) => {
    try {
        const result = await categoryService.createCategory(req.body)
        res.status(201).json(result)
    } catch (err) {
        res.status(400).json({
            error: "Category Creating Failed",
            details: err
        })
    }
}

export const categoryController = {
    createCategory
}