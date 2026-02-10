import { prisma } from "../../lib/prisma";
import { ICreateCategory, IUpdateCategory } from "./category.interface";

// create new category
const createCategory = async (data: ICreateCategory) => {
  const result = await prisma.category.create({
    data,
  });
  return result;
};

// get all categories
const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          meals: true, // this will show hoe many meals in each category
        },
      },
    },
    orderBy: {
      name: "asc", // sort by alphabetically
    },
  });

  return categories;
};

// update category
const updateCategory = async (categoryId: string, data: IUpdateCategory) => {
  // 1. Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // 2. Update category
  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data,
    include: {
      _count: {
        select: {
          meals: true,
        },
      },
    },
  });

  // 3. Return updated category
  return updatedCategory;
};

// delete category
const deleteCategory = async (categoryId: string) => {
  // 1. Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      _count: {
        select: {
          meals: true,
        },
      },
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // 2. Check if category has meals
  if (category._count.meals > 0) {
    throw new Error(
      `Cannot delete category. It has ${category._count.meals} meal/s that is/are associate with it.`,
    );
  }

  // 3. Delete category
  await prisma.category.delete({
    where: { id: categoryId },
  });

  // 4. Return success message
  return { message: "Category deleted successfully!" };
};

export const categoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
