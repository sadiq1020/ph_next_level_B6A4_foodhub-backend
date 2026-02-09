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
router.put("/:id/cancel", auth(ROLES.CUSTOMER), orderController.cancelOrder);

export const orderRouter = router;
