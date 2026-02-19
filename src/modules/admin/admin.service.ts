import { prisma } from "../../lib/prisma";

// Get dashboard stats
const getStats = async () => {
  // Count users by role
  const [totalUsers, totalCustomers, totalProviders] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "PROVIDER" } }),
  ]);

  // Count total orders
  const totalOrders = await prisma.order.count();

  // Count total categories
  const totalCategories = await prisma.category.count();

  return {
    totalUsers,
    totalCustomers,
    totalProviders,
    totalOrders,
    totalCategories,
  };
};

export const adminService = {
  getStats,
};
