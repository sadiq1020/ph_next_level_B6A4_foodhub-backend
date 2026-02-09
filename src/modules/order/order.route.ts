import express from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../shared";
import { orderController } from "./order.controller";
// import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.post("/", auth(ROLES.CUSTOMER), orderController.createOrder);
router.put(
  "/:id/status",
  auth(ROLES.PROVIDER),
  orderController.updateOrderStatus,
);

export const orderRouter = router;
