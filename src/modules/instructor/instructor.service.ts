import { prisma } from "../../lib/prisma";
import {
  ICreateInstructorProfile,
  IUpdateInstructorProfile,
} from "./instructor.interface";

// Create instructor profile + set user role to INSTRUCTOR in one transaction
const createInstructorProfile = async (
  data: ICreateInstructorProfile,
  userId: string,
) => {
  // 1. Check if profile already exists for this user
  const existing = await prisma.instructorProfiles.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new Error("Instructor profile already exists for this user");
  }

  // 2. Run as a transaction — both must succeed or neither does:
  //    a) Create the InstructorProfiles record (status = PENDING by default)
  //    b) Update User.role to INSTRUCTOR
  const result = await prisma.$transaction(async (tx) => {
    const profile = await tx.instructorProfiles.create({
      data: {
        businessName: data.businessName,
        description: data.description ?? null,
        address: data.address,
        logo: data.logo ?? null,
        userId,
        // status defaults to PENDING via schema — not set here
      },
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

    // Promote user role to INSTRUCTOR so dashboard auth guards pass
    await tx.user.update({
      where: { id: userId },
      data: { role: "INSTRUCTOR" },
    });

    return profile;
  });

  return result;
};

// Get my instructor profile (includes status for dashboard banner)
const getMyProfile = async (userId: string) => {
  const profile = await prisma.instructorProfiles.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
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
      _count: {
        select: { courses: true },
      },
    },
  });

  if (!profile) {
    throw new Error("Instructor profile not found");
  }

  return profile;
};

// Update my instructor profile
const updateMyProfile = async (
  userId: string,
  data: IUpdateInstructorProfile,
) => {
  const profile = await prisma.instructorProfiles.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw new Error("Instructor profile not found");
  }

  const updatedProfile = await prisma.instructorProfiles.update({
    where: { id: profile.id },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      },
      _count: {
        select: { courses: true },
      },
    },
  });

  return updatedProfile;
};

// Get enrollments for my courses (Instructor only)
const getMyOrders = async (userId: string) => {
  const profile = await prisma.instructorProfiles.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw new Error("Instructor profile not found");
  }

  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          course: { instructorId: profile.id },
        },
      },
    },
    include: {
      items: {
        where: {
          course: { instructorId: profile.id },
        },
        include: {
          course: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
            },
          },
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
};

// Get instructor profile by ID (Public)
const getInstructorById = async (instructorId: string) => {
  const profile = await prisma.instructorProfiles.findUnique({
    where: { id: instructorId },
    include: {
      courses: {
        where: { isAvailable: true },
        include: {
          category: {
            select: { id: true, name: true },
          },
          instructor: {
            select: { id: true, businessName: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { courses: true },
      },
    },
  });

  if (!profile) {
    throw new Error("Instructor profile not found");
  }

  return profile;
};

// Get all APPROVED instructors (Public — course browse page)
const getAllInstructors = async () => {
  const instructors = await prisma.instructorProfiles.findMany({
    where: { status: "APPROVED" },
    select: {
      id: true,
      businessName: true,
      description: true,
      address: true,
      logo: true,
      createdAt: true,
      _count: {
        select: { courses: true },
      },
    },
    orderBy: { businessName: "asc" },
  });

  return instructors;
};

export const instructorService = {
  createInstructorProfile,
  getMyProfile,
  updateMyProfile,
  getInstructorById,
  getMyOrders,
  getAllInstructors,
};