import { Request, Response } from "express";
import { adminService } from "./admin.service";

// GET /admin/stats
const getStats = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const stats = await adminService.getStats();

    res.status(200).json({
      success: true,
      message: "Stats retrieved successfully",
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve stats",
    });
  }
};

// GET /admin/instructors
// Returns all instructor applications (PENDING, APPROVED, REJECTED)
const getAllInstructorApplications = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const instructors = await adminService.getAllInstructorApplications();

    res.status(200).json({
      success: true,
      message: "Instructor applications retrieved successfully",
      data: instructors,
      total: instructors.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve instructor applications",
    });
  }
};

// PATCH /admin/instructors/:id/approve
const approveInstructor = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // const { id } = req.params;
    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Instructor profile ID is required",
      });
    }

    const result = await adminService.approveInstructor(id);

    res.status(200).json({
      success: true,
      message: `Instructor "${result.businessName}" has been approved`,
      data: result,
    });
  } catch (error: any) {
    const statusCode =
      error.message === "Instructor profile not found" ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to approve instructor",
    });
  }
};

// PATCH /admin/instructors/:id/reject
const rejectInstructor = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // const { id } = req.params;
    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Instructor profile ID is required",
      });
    }

    const result = await adminService.rejectInstructor(id);

    res.status(200).json({
      success: true,
      message: `Instructor "${result.businessName}" application has been rejected`,
      data: result,
    });
  } catch (error: any) {
    const statusCode =
      error.message === "Instructor profile not found" ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to reject instructor",
    });
  }
};

export const adminController = {
  getStats,
  getAllInstructorApplications,
  approveInstructor,
  rejectInstructor,
};