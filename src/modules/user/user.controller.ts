import { Request, Response } from "express";
import { IUpdateProfile } from "./user.interface";
import { userService } from "./user.service";

/**
 * Get all users
 * GET /api/users
 * Auth: Admin only
 */
/*
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Build filters from query params
    const filters: IUserFilters = {
      role: req.query.role as string | undefined,
      isActive: req.query.isActive ? req.query.isActive === "true" : undefined,
      search: req.query.search as string | undefined,
    };

    // Get all users
    const users = await userService.getAllUsers(filters);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
      total: users.length,
    });
  } catch (error: any) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve users",
    });
  }
};
*/

// get all users (Admin only)
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
      total: users.length,
    });
  } catch (error: any) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve users",
    });
  }
};

/**
 * Update user status (suspend/activate)
 * PATCH /api/users/:id/status
 * Auth: Admin only
 */
const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const admin = req.user;

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.params.id as string;
    const { isActive } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive field is required and must be a boolean",
      });
    }

    // Update user status
    const user = await userService.updateUserStatus(userId, isActive);

    res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "suspended"} successfully`,
      data: user,
    });
  } catch (error: any) {
    console.error("Update user status error:", error);

    const statusCode = error.message === "User not found" ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update user status",
    });
  }
};

/**
 * Update own profile
 * PUT /api/users/profile
 * Auth: Customer/Provider/Admin (any authenticated user)
 */
const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { name, phone } = req.body;

    // Validate required fields
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name is required and must be at least 2 characters",
      });
    }

    // Validate phone if provided
    if (phone && !/^[0-9]{10,15}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone must be 10-15 digits",
      });
    }

    const updateData: IUpdateProfile = {
      name: name.trim(),
      phone: phone || null,
    };

    // Update profile
    const updatedUser = await userService.updateProfile(user.id, updateData);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);

    const statusCode = error.message === "User not found" ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};

export const userController = {
  getAllUsers,
  updateUserStatus,
  updateProfile,
};
