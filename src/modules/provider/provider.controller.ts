import { Request, Response } from "express";
import { providerService } from "./provider.service";

// create new category
const createProviderProfile = async (req: Request, res: Response) => {
  try {
    const result = await providerService.createProviderProfile(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Provider Profile Creating Failed",
      details: err,
    });
  }
};

/**
 * Get my provider profile
 * GET /api/provider/profile
 * Auth: Provider only
 */
const getMyProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Get provider profile
    const profile = await providerService.getMyProfile(user.id);

    res.status(200).json({
      success: true,
      message: "Provider profile retrieved successfully",
      data: profile,
    });
  } catch (error: any) {
    console.error("Get provider profile error:", error);

    const statusCode =
      error.message === "Provider profile not found" ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to retrieve provider profile",
    });
  }
};

export const providerController = {
  createProviderProfile,
  getMyProfile,
};
