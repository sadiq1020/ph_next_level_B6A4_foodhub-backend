import express from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../shared";
import { providerController } from "./provider.controller";
// import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.post("/profile", providerController.createProviderProfile);
router.get("/profile", auth(ROLES.PROVIDER), providerController.getMyProfile);
router.put(
  "/profile",
  auth(ROLES.PROVIDER),
  providerController.updateMyProfile,
);

router.get("/orders", auth(ROLES.PROVIDER), providerController.getMyOrders);

export const providerRouter = router;
