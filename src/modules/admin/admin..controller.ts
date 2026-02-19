import { Request, Response } from "express";
import { adminService } from "./admin.service";

/**
 * Get admin dashboard stats
 * GET /api/admin/stats
 * Auth: Admin only
 */
const getStats = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const stats = await adminService.getStats();

    res.status(200).json({
      success: true,
      message: "Stats retrieved successfully",
      data: stats,
    });
  } catch (error: any) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve stats",
    });
  }
};

export const adminController = {
  getStats,
};
