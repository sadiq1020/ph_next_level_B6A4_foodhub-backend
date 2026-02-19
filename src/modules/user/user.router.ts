import express from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../shared";
import { userController } from "./user.controller";

const router = express.Router();

// // Customer/Provider/Admin - update own profile
router.put(
  "/profile",
  auth(ROLES.CUSTOMER, ROLES.PROVIDER, ROLES.ADMIN),
  userController.updateProfile,
);
// Admin routes
router.get("/", auth(ROLES.ADMIN), userController.getAllUsers);
router.patch("/:id/status", auth(ROLES.ADMIN), userController.updateUserStatus);

export const userRouter = router;
