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
// GET /reviews/top — Public, no auth required
// Returns latest 3 five-star reviews with a comment for home page testimonials
const getTopReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getTopReviews();
 
    res.status(200).json({
      success: true,
      message: "Top reviews retrieved successfully",
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve reviews",
    });
  }
};

export const reviewController = {
  createReview,
  getTopReviews
};
