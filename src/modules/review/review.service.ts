import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./review.interface";

// Create a course review (CUSTOMER only, must have an ACTIVE/COMPLETED enrollment)
const createReview = async (data: ICreateReview) => {
  // 1. Check if course exists
  const course = await prisma.course.findUnique({
    where: { id: data.courseId },
    select: { id: true, name: true },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  // 2. Check if customer has enrolled in this course and it's active or completed
  const hasEnrolled = await prisma.order.findFirst({
    where: {
      customerId: data.customerId,
      status: { in: ["ACTIVE", "COMPLETED"] },
      items: {
        some: { courseId: data.courseId },
      },
    },
  });

  if (!hasEnrolled) {
    throw new Error("You can only review courses you are enrolled in");
  }

  // 3. Check if customer already reviewed this course
  const existingReview = await prisma.review.findFirst({
    where: {
      customerId: data.customerId,
      courseId: data.courseId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this course");
  }

  // 4. Validate rating (1–5)
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // 5. Create review
  const review = await prisma.review.create({
    data: {
      customerId: data.customerId,
      courseId: data.courseId,
      rating: data.rating,
      comment: data.comment ?? null,
    },
    include: {
      customer: {
        select: { id: true, name: true },
      },
      course: {
        select: { id: true, name: true },
      },
    },
  });

  return review;
};

// Get top 5-star reviews for the home page testimonials section (Public)
const getTopReviews = async () => {
  const reviews = await prisma.review.findMany({
    where: {
      rating: 5,
      comment: { not: null }, // only show reviews that have a comment
    },
    include: {
      customer: {
        select: { id: true, name: true },
      },
      course: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 3, // latest 3 five-star reviews
  });
 
  return reviews;
};

export const reviewService = {
  createReview,
  getTopReviews
};
