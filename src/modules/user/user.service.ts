import { prisma } from "../../lib/prisma";

// // get all users (Admin only)
// const getAllUsers = async (filters: IUserFilters) => {
//   const { role, isActive, search } = filters;

//   const users = await prisma.user.findMany({
//     where: {
//       // Filter by role
//       ...(role && { role: role as any }),

//       // Filter by active status
//       ...(isActive !== undefined && { isActive }),

//       // Search by name or email
//       ...(search && {
//         OR: [
//           { name: { contains: search, mode: "insensitive" } },
//           { email: { contains: search, mode: "insensitive" } },
//         ],
//       }),
//     },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       phone: true,
//       role: true,
//       isActive: true,
//       emailVerified: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//     orderBy: {
//       createdAt: "desc", // Most recent users first
//     },
//   });

//   return users;
// };

// get all users (Admin only)
const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};
export const userService = {
  getAllUsers,
};
