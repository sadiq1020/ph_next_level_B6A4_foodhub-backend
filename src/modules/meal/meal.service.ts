import { prisma } from "../../lib/prisma";
import { ICreateMeal, IMealFilters } from "./meal.interface";

// create a meal with validation
const createMeal = async (data: ICreateMeal, userId: string) => {
  // 1. Verify provider exists
  const provider = await prisma.providerProfiles.findUnique({
    where: { id: data.providerId },
    select: { id: true, userId: true },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }

  // 2. Verify provider's userId matches authenticated user
  if (provider.userId !== userId) {
    throw new Error("You can only create meals for your own provider profile");
  }

  // 3. Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
    select: { id: true },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // 4. Create meal
  const result = await prisma.meal.create({
    data,
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          businessName: true,
        },
      },
    },
  });

  return result;
};

// get all meals with filters - KEEP USING THE ORIGINAL PRISMA IMPORT
const getAllMeals = async (filters: IMealFilters) => {
  const { categoryId, dietary, minPrice, maxPrice, search, providerId } =
    filters;

  const result = await prisma.meal.findMany({
    // ... rest stays exactly the same
    where: {
      isAvailable: true,
      ...(categoryId && { categoryId }),
      ...(providerId && { providerId }),
      ...(dietary && { dietary: { has: dietary } }),
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
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

// get meal by id - KEEP USING THE ORIGINAL PRISMA IMPORT
const getMealById = async (mealId: string) => {
  const result = await prisma.meal.findUnique({
    // ... rest stays exactly the same
    where: { id: mealId },
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

  const averageRating =
    result.reviews.length > 0
      ? result.reviews.reduce((sum, review) => sum + review.rating, 0) /
        result.reviews.length
      : 0;

  return {
    ...result,
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews: result.reviews.length,
  };
};

export const mealService = {
  createMeal,
  getAllMeals,
  getMealById,
};
