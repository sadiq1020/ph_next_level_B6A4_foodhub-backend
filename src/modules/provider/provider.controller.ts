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

/**
 * Update my provider profile
 * PUT /api/provider/profile
 * Auth: Provider only
 */
const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Update provider profile
    const profile = await providerService.updateMyProfile(user.id, req.body);

    res.status(200).json({
      success: true,
      message: "Provider profile updated successfully",
      data: profile,
    });
  } catch (error: any) {
    console.error("Update provider profile error:", error);

    const statusCode =
      error.message === "Provider profile not found" ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update provider profile",
    });
  }
};

/**
 * Get orders for my meals
 * GET /api/provider/orders
 * Auth: Provider only
 */
const getMyOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Get orders that contain this provider's meals
    const orders = await providerService.getMyOrders(user.id);

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
      total: orders.length,
    });
  } catch (error: any) {
    console.error("Get provider orders error:", error);

    const statusCode =
      error.message === "Provider profile not found" ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to retrieve orders",
    });
  }
};

/**
 * Get provider profile by ID (Public)
 * GET /api/provider-profiles/:id
 * No auth required
 */
const getProviderById = async (req: Request, res: Response) => {
  try {
    const providerId = req.params.id as string;

    if (!providerId) {
      return res.status(400).json({
        success: false,
        message: "Provider ID is required",
      });
    }

    // Get provider profile
    const profile = await providerService.getProviderById(providerId);

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

/**
 * Get all providers (Public)
 * GET /api/provider-profiles
 * No auth required
 */
const getAllProviders = async (req: Request, res: Response) => {
  try {
    const providers = await providerService.getAllProviders();

    res.status(200).json({
      success: true,
      message: "Providers retrieved successfully",
      data: providers,
      total: providers.length,
    });
  } catch (error: any) {
    console.error("Get all providers error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve providers",
    });
  }
};

export const providerController = {
  createProviderProfile,
  getMyProfile,
  updateMyProfile,
  getProviderById,
  getMyOrders,
  getAllProviders,
};
