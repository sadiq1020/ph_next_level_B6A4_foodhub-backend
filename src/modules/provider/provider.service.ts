import { prisma } from "../../lib/prisma";
import { ICreateProviderProfile } from "./provider.interface";

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

export const providerService = {
  createProviderProfile,
  getMyProfile,
};
