import express from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../shared";
import { orderController } from "./order.controller";
// import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.post("/", auth(ROLES.CUSTOMER), orderController.createOrder);

// Admin routes (⚠️ Place BEFORE /:id routes)
router.get(
  "/admin/all",
  auth(ROLES.ADMIN),
  orderController.getAllOrdersForAdmin,
);

router.put(
  "/:id/status",
  auth(ROLES.PROVIDER),
  orderController.updateOrderStatus,
);

router.put("/:id/cancel", auth(ROLES.CUSTOMER), orderController.cancelOrder);
router.get("/", auth(ROLES.CUSTOMER), orderController.getMyOrders);

export const orderRouter = router;
