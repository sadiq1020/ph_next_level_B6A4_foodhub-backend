import { Request, Response } from "express";
import { userService } from "./user.service";

/**
 * Get all users
 * GET /api/users
 * Auth: Admin only
 */
// const getAllUsers = async (req: Request, res: Response) => {
//   try {
//     const user = req.user;

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     // Build filters from query params
//     const filters: IUserFilters = {
//       role: req.query.role as string | undefined,
//       isActive: req.query.isActive ? req.query.isActive === "true" : undefined,
//       search: req.query.search as string | undefined,
//     };

//     // Get all users
//     const users = await userService.getAllUsers(filters);

//     res.status(200).json({
//       success: true,
//       message: "Users retrieved successfully",
//       data: users,
//       total: users.length,
//     });
//   } catch (error: any) {
//     console.error("Get all users error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to retrieve users",
//     });
//   }
// };

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
      total: users.length,
    });
  } catch (error: any) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve users",
    });
  }
};
export const userController = {
  getAllUsers,
};
