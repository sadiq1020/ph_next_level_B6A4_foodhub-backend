import express from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../shared";
import { providerController } from "./provider.controller";
// import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.post("/profile", providerController.createProviderProfile);
router.get("/profile", auth(ROLES.PROVIDER), providerController.getMyProfile);

export const providerRouter = router;
