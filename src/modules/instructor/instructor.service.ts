import { prisma } from "../../lib/prisma";
import {
  ICreateInstructorProfile,
  IUpdateInstructorProfile,
} from "./instructor.interface";

const createInstructorProfile = async (
  data: ICreateInstructorProfile,
  userId: string,
) => {
  const existing = await prisma.instructorProfiles.findUnique({
    where: { userId },
  });

  if (existing) throw new Error("Instructor profile already exists");

  const result = await prisma.$transaction(async (tx) => {
    const profile = await tx.instructorProfiles.create({
      data: {
        userId,
        businessName: data.businessName,
        description: data.description ?? null,
        address: data.address,
        logo: data.logo ?? null,
        status: "PENDING",
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { role: "INSTRUCTOR" },
    });

    return profile;
  });

  return result;
};

const getMyProfile = async (userId: string) => {
  const profile = await prisma.instructorProfiles.findUnique({
    where: { userId },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true, role: true },
      },
      courses: {
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
          isAvailable: true,
          duration: true,
          difficulty: true,
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { courses: true } },
    },
  });

  if (!profile) throw new Error("Instructor profile not found");
  return profile;
};

const updateMyProfile = async (
  userId: string,
  data: IUpdateInstructorProfile,
) => {
  const profile = await prisma.instructorProfiles.findUnique({
    where: { userId },
  });

  if (!profile) throw new Error("Instructor profile not found");

  return await prisma.instructorProfiles.update({
    where: { userId },
    data: {
      ...(data.businessName && { businessName: data.businessName }),
      ...(data.address && { address: data.address }),
      description: data.description ?? null,
      logo: data.logo ?? null,
    },
  });
};

const getInstructorById = async (instructorId: string) => {
  const instructor = await prisma.instructorProfiles.findUnique({
    where: { id: instructorId },
    include: {
      courses: {
        where: { isAvailable: true },
        include: {
          category: true,
          _count: { select: { reviews: true } },
        },
      },
      _count: { select: { courses: true } },
    },
  });

  if (!instructor) throw new Error("Instructor not found");
  return instructor;
};

const getMyOrders = async (userId: string) => {
  const profile = await prisma.instructorProfiles.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) throw new Error("Instructor profile not found");

  const orders = await prisma.order.findMany({
    where: {
      items: { some: { course: { instructorId: profile.id } } },
    },
    include: {
      items: {
        where: { course: { instructorId: profile.id } },
        include: {
          course: { select: { id: true, name: true, image: true, price: true } },
        },
      },
      customer: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
};

const getAllInstructors = async () => {
  return await prisma.instructorProfiles.findMany({
    where: { status: "APPROVED" },
    include: {
      _count: { select: { courses: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

// ── Chart data for instructor dashboard ──────────────────────────────────────
const getChartData = async (userId: string) => {
  const profile = await prisma.instructorProfiles.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) throw new Error("Instructor profile not found");

  // 1. Enrollments per course (bar chart)
  const courses = await prisma.course.findMany({
    where: { instructorId: profile.id },
    select: {
      id: true,
      name: true,
      price: true,
      _count: { select: { enrollmentItems: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 8, // max 8 bars
  });

  const enrollmentsPerCourse = courses.map((c) => ({
    course: c.name.length > 18 ? c.name.slice(0, 18) + "…" : c.name,
    enrollments: c._count.enrollmentItems,
    revenue: c._count.enrollmentItems * Number(c.price),
  }));

  // 2. Revenue over time — last 6 months (line chart)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: sixMonthsAgo },
      status: { in: ["ACTIVE", "COMPLETED"] },
      items: { some: { course: { instructorId: profile.id } } },
    },
    include: {
      items: {
        where: { course: { instructorId: profile.id } },
        select: { price: true, quantity: true },
      },
    },
  });

  // Pre-fill 6 months with zeros
  const monthMap: Record<string, { month: string; revenue: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthMap[key] = {
      month: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      revenue: 0,
    };
  }

  for (const order of orders) {
    const key = `${order.createdAt.getFullYear()}-${String(
      order.createdAt.getMonth() + 1,
    ).padStart(2, "0")}`;
    if (monthMap[key]) {
      const orderRevenue = order.items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      );
      monthMap[key].revenue += orderRevenue;
    }
  }

  const revenueOverTime = Object.values(monthMap);

  return { enrollmentsPerCourse, revenueOverTime };
};

export const instructorService = {
  createInstructorProfile,
  getMyProfile,
  updateMyProfile,
  getInstructorById,
  getMyOrders,
  getAllInstructors,
  getChartData,
};