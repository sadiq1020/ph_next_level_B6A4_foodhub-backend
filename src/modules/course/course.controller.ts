import { Request, Response } from "express";
import { ICourseFilters } from "./course.interface";
import { courseService } from "./course.service";

// POST /courses — INSTRUCTOR only
const createCourse = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await courseService.createCourse(req.body, user.id);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create course",
    });
  }
};

// GET /courses — public, with optional filters
const getAllCourses = async (req: Request, res: Response) => {
  try {
    const filters: ICourseFilters = {
      categoryId: req.query.categoryId as string | undefined,
      difficulty: req.query.difficulty as string | undefined,
      instructorId: req.query.instructorId as string | undefined,
      search: req.query.search as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    };

    const result = await courseService.getAllCourses(filters);

    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      data: result,
      total: result.length,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve courses",
    });
  }
};

// GET /courses/my-courses — INSTRUCTOR only
const getMyCourses = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await courseService.getMyCourses(user.id);

    res.status(200).json({
      success: true,
      message: "Your courses retrieved successfully",
      data: result,
      total: result.length,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve your courses",
    });
  }
};

// GET /courses/:id — public
const getCourseById = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id as string;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const result = await courseService.getCourseById(courseId);

    res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.message === "Course not found" ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to retrieve course",
    });
  }
};

// PUT /courses/:id — INSTRUCTOR only
const updateCourse = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const courseId = req.params.id as string;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const result = await courseService.updateCourse(courseId, req.body, user.id);

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update course",
    });
  }
};

// DELETE /courses/:id — INSTRUCTOR only
const deleteCourse = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const courseId = req.params.id as string;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const result = await courseService.deleteCourse(courseId, user.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete course",
    });
  }
};

export const courseController = {
  createCourse,
  getAllCourses,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
