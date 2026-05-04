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

  // Pending instructor applications count — useful for admin dashboard badge
  const pendingInstructors = await prisma.instructorProfiles.count({
    where: { status: "PENDING" },
  });

  return {
    totalUsers,
    totalCustomers,
    totalInstructors,  // was: totalProviders
    totalOrders,
    totalCategories,
    pendingInstructors,
  };
};

// Get all instructor applications (Admin only)
// Returns all statuses so admin can see PENDING, APPROVED, and REJECTED
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
      _count: {
        select: { courses: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return instructors;
};

// Approve an instructor application
const approveInstructor = async (instructorProfileId: string) => {
  // 1. Find the profile
  const profile = await prisma.instructorProfiles.findUnique({
    where: { id: instructorProfileId },
    select: { id: true, status: true, userId: true },
  });

  if (!profile) {
    throw new Error("Instructor profile not found");
  }

  if (profile.status === "APPROVED") {
    throw new Error("Instructor is already approved");
  }

  // 2. Set status to APPROVED
  const updatedProfile = await prisma.instructorProfiles.update({
    where: { id: instructorProfileId },
    data: { status: "APPROVED" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
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

  if (!profile) {
    throw new Error("Instructor profile not found");
  }

  if (profile.status === "REJECTED") {
    throw new Error("Instructor application is already rejected");
  }

  // Set status to REJECTED and demote role back to CUSTOMER
  const [updatedProfile] = await prisma.$transaction([
    prisma.instructorProfiles.update({
      where: { id: instructorProfileId },
      data: { status: "REJECTED" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
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
  getAllInstructorApplications,
  approveInstructor,
  rejectInstructor,
};
