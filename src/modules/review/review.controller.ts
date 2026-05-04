import { Request, Response } from "express";
import { reviewService } from "./review.service";

// POST /reviews — CUSTOMER only
const createReview = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { courseId, rating, comment } = req.body;

    if (!courseId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Course ID and rating are required",
      });
    }

    const review = await reviewService.createReview({
      courseId,
      customerId: user.id,
      rating: Number(rating),
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to submit review",
    });
  }
};

export const reviewController = {
  createReview,
};
