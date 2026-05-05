import { Request, Response } from "express";
import { instructorService } from "./instructor.service";

const createInstructorProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const result = await instructorService.createInstructorProfile(req.body, user.id);
    res.status(201).json({ success: true, message: "Instructor profile created. Your application is pending admin approval.", data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Failed to create instructor profile" });
  }
};

const getMyProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const profile = await instructorService.getMyProfile(user.id);
    res.status(200).json({ success: true, message: "Instructor profile retrieved successfully", data: profile });
  } catch (error: any) {
    const statusCode = error.message === "Instructor profile not found" ? 404 : 500;
    res.status(statusCode).json({ success: false, message: error.message || "Failed to retrieve instructor profile" });
  }
};

const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const profile = await instructorService.updateMyProfile(user.id, req.body);
    res.status(200).json({ success: true, message: "Instructor profile updated successfully", data: profile });
  } catch (error: any) {
    const statusCode = error.message === "Instructor profile not found" ? 404 : 400;
    res.status(statusCode).json({ success: false, message: error.message || "Failed to update instructor profile" });
  }
};

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const orders = await instructorService.getMyOrders(user.id);
    res.status(200).json({ success: true, message: "Enrollments retrieved successfully", data: orders, total: orders.length });
  } catch (error: any) {
    const statusCode = error.message === "Instructor profile not found" ? 404 : 500;
    res.status(statusCode).json({ success: false, message: error.message || "Failed to retrieve enrollments" });
  }
};

// GET /instructor/charts — INSTRUCTOR only
const getChartData = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const data = await instructorService.getChartData(user.id);
    res.status(200).json({ success: true, message: "Chart data retrieved successfully", data });
  } catch (error: any) {
    const statusCode = error.message === "Instructor profile not found" ? 404 : 500;
    res.status(statusCode).json({ success: false, message: error.message || "Failed to retrieve chart data" });
  }
};

const getInstructorById = async (req: Request, res: Response) => {
  try {
    const instructorId = req.params.id as string;
    if (!instructorId) return res.status(400).json({ success: false, message: "Instructor ID is required" });
    const profile = await instructorService.getInstructorById(instructorId);
    res.status(200).json({ success: true, message: "Instructor profile retrieved successfully", data: profile });
  } catch (error: any) {
    const statusCode = error.message === "Instructor not found" ? 404 : 500;
    res.status(statusCode).json({ success: false, message: error.message || "Failed to retrieve instructor profile" });
  }
};

const getAllInstructors = async (req: Request, res: Response) => {
  try {
    const instructors = await instructorService.getAllInstructors();
    res.status(200).json({ success: true, message: "Instructors retrieved successfully", data: instructors, total: instructors.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to retrieve instructors" });
  }
};

export const instructorController = {
  createInstructorProfile,
  getMyProfile,
  updateMyProfile,
  getMyOrders,
  getChartData,
  getInstructorById,
  getAllInstructors,
};