import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./review.interface";

// create review (Customer only, after order delivered)
const createReview = async (data: ICreateReview) => {
  // 1. Check if meal exists
  const meal = await prisma.meal.findUnique({
    where: { id: data.mealId },
    select: { id: true, name: true },
  });

  if (!meal) {
    throw new Error("Meal not found");
  }

  // 2. Check if customer has ordered this meal and it was delivered
  const hasOrderedMeal = await prisma.order.findFirst({
    where: {
      customerId: data.customerId,
      status: "DELIVERED",
      items: {
        some: {
          mealId: data.mealId,
        },
      },
    },
  });

  if (!hasOrderedMeal) {
    throw new Error("You can only review meals from your delivered orders");
  }

  // 3. Check if customer already reviewed this meal
  const existingReview = await prisma.review.findFirst({
    where: {
      customerId: data.customerId,
      mealId: data.mealId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this meal");
  }

  // 4. Validate rating (1-5)
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // 5. Create review
  const review = await prisma.review.create({
    data,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
      meal: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return review;
};

export const reviewService = {
  createReview,
};
