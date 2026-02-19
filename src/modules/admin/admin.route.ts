import express from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../shared";
import { adminController } from "./admin..controller";

const router = express.Router();

router.get("/stats", auth(ROLES.ADMIN), adminController.getStats);

export const adminRouter = router;
