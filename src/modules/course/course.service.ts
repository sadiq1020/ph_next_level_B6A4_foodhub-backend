import { prisma } from "../../lib/prisma";
import { ICourseFilters, ICreateCourse, IUpdateCourse } from "./course.interface";

// ── Build Prisma orderBy from sort param ─────────────
function buildOrderBy(sort?: string) {
  switch (sort) {
    case "price_asc":
      return { price: "asc" as const };
    case "price_desc":
      return { price: "desc" as const };
    case "most_reviewed":
      return { reviews: { _count: "desc" as const } };
    case "newest":
    default:
      return { createdAt: "desc" as const };
  }
}

// Create a course (INSTRUCTOR only, must be APPROVED)
const createCourse = async (data: ICreateCourse, userId: string) => {
  const instructor = await prisma.instructorProfiles.findUnique({
    where: { id: data.instructorId },
    select: { id: true, userId: true, status: true },
  });

  if (!instructor) throw new Error("Instructor profile not found");
  if (instructor.userId !== userId)
    throw new Error("You can only create courses for your own instructor profile");
  if (instructor.status !== "APPROVED")
    throw new Error("Your instructor application must be approved before you can create courses");

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
    select: { id: true },
  });

  if (!category) throw new Error("Category not found");

  const result = await prisma.course.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      image: data.image ?? null,
      categoryId: data.categoryId,
      instructorId: data.instructorId,
      tags: data.tags ?? [],
      videoUrl: data.videoUrl ?? null,
      duration: data.duration ?? null,
      difficulty: data.difficulty ?? null,
      lessonsCount: data.lessonsCount ?? null,
    },
    include: {
      category: true,
      instructor: { select: { id: true, businessName: true } },
    },
  });

  return result;
};

// Get all courses with filters, sort, and pagination (public)
const getAllCourses = async (filters: ICourseFilters) => {
  const {
    categoryId,
    difficulty,
    minPrice,
    maxPrice,
    search,
    instructorId,
    sort,
    page = 1,
    limit = 12,
  } = filters;

  const where = {
    isAvailable: true,
    ...(categoryId && { categoryId }),
    ...(instructorId && { instructorId }),
    ...(difficulty && { difficulty }),
    price: {
      ...(minPrice !== undefined && { gte: minPrice }),
      ...(maxPrice !== undefined && { lte: maxPrice }),
    },
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  // Run count and data fetch in parallel for performance
  const [total, courses] = await Promise.all([
    prisma.course.count({ where }),
    prisma.course.findMany({
      where,
      include: {
        category: true,
        instructor: { select: { id: true, businessName: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: buildOrderBy(sort),
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    courses,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

// Get course by ID (public)
const getCourseById = async (courseId: string) => {
  const result = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      category: true,
      instructor: {
        select: { id: true, businessName: true, address: true },
      },
      reviews: {
        include: {
          customer: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!result) throw new Error("Course not found");

  const averageRating =
    result.reviews.length > 0
      ? result.reviews.reduce((sum, r) => sum + r.rating, 0) / result.reviews.length
      : 0;

  return {
    ...result,
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews: result.reviews.length,
  };
};

// Update a course (INSTRUCTOR only)
const updateCourse = async (courseId: string, data: IUpdateCourse, userId: string) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { instructor: { select: { id: true, userId: true } } },
  });

  if (!course) throw new Error("Course not found");
  if (course.instructor.userId !== userId)
    throw new Error("You can only update your own courses");

  const result = await prisma.course.update({
    where: { id: courseId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      ...(data.tags !== undefined && { tags: data.tags }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.lessonsCount !== undefined && { lessonsCount: data.lessonsCount }),
      description: data.description ?? null,
      image: data.image ?? null,
      videoUrl: data.videoUrl ?? null,
      difficulty: data.difficulty ?? null,
    },
    include: {
      category: true,
      instructor: { select: { id: true, businessName: true } },
    },
  });

  return result;
};

// Delete a course (INSTRUCTOR only)
const deleteCourse = async (courseId: string, userId: string) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { instructor: { select: { id: true, userId: true } } },
  });

  if (!course) throw new Error("Course not found");
  if (course.instructor.userId !== userId)
    throw new Error("You can only delete your own courses");

  await prisma.course.delete({ where: { id: courseId } });
  return { message: "Course deleted successfully" };
};

// Get all courses by this instructor
const getMyCourses = async (userId: string) => {
  const instructor = await prisma.instructorProfiles.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!instructor) throw new Error("Instructor profile not found");

  const courses = await prisma.course.findMany({
    where: { instructorId: instructor.id },
    include: {
      category: { select: { id: true, name: true } },
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return courses;
};

export const courseService = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getMyCourses,
};