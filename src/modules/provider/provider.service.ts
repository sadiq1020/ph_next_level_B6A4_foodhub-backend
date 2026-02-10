import { prisma } from "../../lib/prisma";
import {
  ICreateProviderProfile,
  IUpdateProviderProfile,
} from "./provider.interface";

// create new category
const createProviderProfile = async (data: ICreateProviderProfile) => {
  const result = await prisma.providerProfiles.create({
    data,
  });
  return result;
};

// get my provider profile
const getMyProfile = async (userId: string) => {
  // Find provider profile by userId
  const profile = await prisma.providerProfiles.findUnique({
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
      meals: {
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
          isAvailable: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          meals: true,
        },
      },
    },
  });

  // If no profile exists
  if (!profile) {
    throw new Error("Provider profile not found");
  }

  return profile;
};

// update my provider profile
const updateMyProfile = async (
  userId: string,
  data: IUpdateProviderProfile,
) => {
  // 1. Find provider profile by userId
  const profile = await prisma.providerProfiles.findUnique({
    where: { userId },
    select: { id: true },
  });

  // 2. Verify profile exists
  if (!profile) {
    throw new Error("Provider profile not found");
  }

  // 3. Update provider profile
  const updatedProfile = await prisma.providerProfiles.update({
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
        select: {
          meals: true,
        },
      },
    },
  });

  // 4. Return updated profile
  return updatedProfile;
};

export const providerService = {
  createProviderProfile,
  getMyProfile,
  updateMyProfile,
};
