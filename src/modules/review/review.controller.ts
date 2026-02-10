import { Request, Response } from "express";
import { reviewService } from "./review.service";

/**
 * Create review
 * POST /api/reviews
 * Auth: Customer only
 */
const createReview = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { mealId, rating, comment } = req.body;

    // Validate required fields
    if (!mealId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Meal ID and rating are required",
      });
    }

    // Create review
    const review = await reviewService.createReview({
      mealId,
      customerId: user.id,
      rating: Number(rating),
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error: any) {
    console.error("Create review error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create review",
    });
  }
};

export const reviewController = {
  createReview,
};
