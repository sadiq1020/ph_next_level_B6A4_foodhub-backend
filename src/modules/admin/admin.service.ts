import { prisma } from "../../lib/prisma";

// Get dashboard stats
const getStats = async () => {
  const [totalUsers, totalCustomers, totalInstructors] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "INSTRUCTOR" } }),
  ]);

  const totalOrders = await prisma.order.count();
  const totalCategories = await prisma.category.count();

  const pendingInstructors = await prisma.instructorProfiles.count({
    where: { status: "PENDING" },
  });

  return {
    totalUsers,
    totalCustomers,
    totalInstructors,
    totalOrders,
    totalCategories,
    pendingInstructors,
  };
};

// ── Chart data: enrollments per day for the last 30 days ────────────────────
const getEnrollmentTrend = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true, total: true },
    orderBy: { createdAt: "asc" },
  });

  // Build a map of date → { enrollments, revenue }
  const map: Record<string, { enrollments: number; revenue: number }> = {};

  // Pre-fill all 30 days with zeros so gaps show as 0
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    map[key] = { enrollments: 0, revenue: 0 };
  }

  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    if (map[key]) {
      map[key].enrollments += 1;
      map[key].revenue += Number(order.total);
    }
  }

  return Object.entries(map).map(([date, val]) => ({
    date,
    // Short label for x-axis: "May 5"
    label: new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    enrollments: val.enrollments,
    revenue: val.revenue,
  }));
};

// ── Chart data: revenue per month for last 6 months ─────────────────────────
const getRevenueByMonth = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: sixMonthsAgo },
      status: { in: ["ACTIVE", "COMPLETED"] },
    },
    select: { createdAt: true, total: true },
  });

  // Pre-fill 6 months
  const map: Record<string, { month: string; revenue: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map[key] = {
      month: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      revenue: 0,
    };
  }

  for (const order of orders) {
    const key = `${order.createdAt.getFullYear()}-${String(
      order.createdAt.getMonth() + 1
    ).padStart(2, "0")}`;
    if (map[key]) {
      map[key].revenue += Number(order.total);
    }
  }

  return Object.values(map);
};

// ── Chart data: user role distribution ──────────────────────────────────────
const getUserRoleDistribution = async () => {
  const [customers, instructors, admins] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "INSTRUCTOR" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
  ]);

  return [
    { role: "Customers", count: customers, fill: "var(--color-customers)" },
    { role: "Instructors", count: instructors, fill: "var(--color-instructors)" },
    { role: "Admins", count: admins, fill: "var(--color-admins)" },
  ];
};

// Get all instructor applications
const getAllInstructorApplications = async () => {
  const instructors = await prisma.instructorProfiles.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
        },
      },
      _count: { select: { courses: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return instructors;
};

// Approve an instructor application
const approveInstructor = async (instructorProfileId: string) => {
  const profile = await prisma.instructorProfiles.findUnique({
    where: { id: instructorProfileId },
    select: { id: true, status: true, userId: true },
  });

  if (!profile) throw new Error("Instructor profile not found");
  if (profile.status === "APPROVED") throw new Error("Instructor is already approved");

  const updatedProfile = await prisma.instructorProfiles.update({
    where: { id: instructorProfileId },
    data: { status: "APPROVED" },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  });

  return updatedProfile;
};

// Reject an instructor application
const rejectInstructor = async (instructorProfileId: string) => {
  const profile = await prisma.instructorProfiles.findUnique({
    where: { id: instructorProfileId },
    select: { id: true, status: true, userId: true },
  });

  if (!profile) throw new Error("Instructor profile not found");
  if (profile.status === "REJECTED") throw new Error("Instructor application is already rejected");

  const [updatedProfile] = await prisma.$transaction([
    prisma.instructorProfiles.update({
      where: { id: instructorProfileId },
      data: { status: "REJECTED" },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    }),
    prisma.user.update({
      where: { id: profile.userId },
      data: { role: "CUSTOMER" },
    }),
  ]);

  return updatedProfile;
};

export const adminService = {
  getStats,
  getEnrollmentTrend,
  getRevenueByMonth,
  getUserRoleDistribution,
  getAllInstructorApplications,
  approveInstructor,
  rejectInstructor,
};