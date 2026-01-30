import { NextFunction, Request, Response } from "express";
import { providerService } from "./provider.service";

// create new category
const createProviderProfile = async (req: Request, res: Response) => {
    try {
        const result = await providerService.createProviderProfile(req.body)
        res.status(201).json(result)
    } catch (err) {
        res.status(400).json({
            error: "Provider Profile Creating Failed",
            details: err
        })
    }
}

export const providerController = {
    createProviderProfile
}