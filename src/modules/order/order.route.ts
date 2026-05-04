import express from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../shared";
import { orderController } from "./order.controller";

const router = express.Router();

router.post("/", auth(ROLES.CUSTOMER), orderController.createOrder);

router.get("/admin/all", auth(ROLES.ADMIN), orderController.getAllOrdersForAdmin);

router.put("/:id/status", auth(ROLES.INSTRUCTOR), orderController.updateOrderStatus);  // was: PROVIDER

router.put("/:id/cancel", auth(ROLES.CUSTOMER), orderController.cancelOrder);

router.get("/", auth(ROLES.CUSTOMER), orderController.getMyOrders);

router.get("/:id", auth(ROLES.CUSTOMER, ROLES.INSTRUCTOR), orderController.getOrderById);  // was: PROVIDER

export const orderRouter = router;
