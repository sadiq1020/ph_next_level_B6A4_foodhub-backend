import { prisma } from "../../lib/prisma";
import { ICreateMeal, IMealFilters } from "./meal.interface";

// create a meal
const createMeal = async (data: ICreateMeal) => {
  const result = await prisma.meal.create({
    data,
  });
  return result;
};

// get all meals with filters
const getAllMeals = async (filters: IMealFilters) => {
  const { categoryId, dietary, minPrice, maxPrice, search, providerId } =
    filters;

  const result = await prisma.meal.findMany({
    where: {
      isAvailable: true,

      // Filter by category (cuisine)
      ...(categoryId && { categoryId }),

      // Filter by provider
      ...(providerId && { providerId }),

      // Filter by dietary (for example: "vegetarian", "vegan")
      // checks if the dietary array in the DB contains the given value
      ...(dietary && { dietary: { has: dietary } }),

      // Filter by price range
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },

      // Search by name or description (case-insensitive)
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          businessName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

// get meal by id
// const getMealById = async (mealId: string) => {
//   const result = await prisma.meal.findUnique({
//     where: {
//       id: mealId,
//     },
//     include: {
//       category: true,
//       provider: {
//         select: {
//           id: true,
//           businessName: true,
//         },
//       },
//     },
//   });
//   return result;
// };

// get meal by id
const getMealById = async (mealId: string) => {
  const result = await prisma.meal.findUnique({
    where: {
      id: mealId,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          businessName: true,
          address: true,
        },
      },
      reviews: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!result) {
    throw new Error("Meal not found");
  }

  // Calculate average rating from reviews
  const averageRating =
    result.reviews.length > 0
      ? result.reviews.reduce((sum, review) => sum + review.rating, 0) /
        result.reviews.length
      : 0;

  return {
    ...result,
    averageRating: Number(averageRating.toFixed(1)), // Round to 1 decimal place
    totalReviews: result.reviews.length,
  };
};

export const mealService = {
  createMeal,
  getAllMeals,
  getMealById,
};
