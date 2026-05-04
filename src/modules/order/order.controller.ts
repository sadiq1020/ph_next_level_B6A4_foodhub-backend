import { Request, Response } from "express";
import { orderService } from "./order.service";

// POST /orders — CUSTOMER only
const createOrder = async (req: Request, res: Response) => {
  try {
    const { notes, items } = req.body;
    const customerId = req.user!.id;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one course is required to enroll",
      });
    }

    const order = await orderService.createOrder({
      customerId,
      notes,
      items,
    });

    res.status(201).json({
      success: true,
      message: "Enrollment successful",
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create enrollment",
    });
  }
};

// PUT /orders/:id/status — INSTRUCTOR only
const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orderId = req.params.id as string;
    const { status } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Enrollment ID is required" });
    }

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const order = await orderService.updateOrderStatus(orderId, status, user.id);

    res.status(200).json({
      success: true,
      message: "Enrollment status updated successfully",
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update enrollment status",
    });
  }
};

// PUT /orders/:id/cancel — CUSTOMER only
const cancelOrder = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orderId = req.params.id as string;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Enrollment ID is required" });
    }

    const order = await orderService.cancelOrder(orderId, user.id);

    res.status(200).json({
      success: true,
      message: "Enrollment cancelled successfully",
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to cancel enrollment",
    });
  }
};

// GET /orders — CUSTOMER only (my enrollments)
const getMyOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await orderService.getMyOrders(user.id);

    res.status(200).json({
      success: true,
      message: "Your enrollments retrieved successfully",
      data: orders,
      total: orders.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve enrollments",
    });
  }
};

// GET /orders/admin/all — ADMIN only
const getAllOrdersForAdmin = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await orderService.getAllOrdersForAdmin();

    res.status(200).json({
      success: true,
      message: "All enrollments retrieved successfully",
      data: orders,
      total: orders.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve enrollments",
    });
  }
};

// GET /orders/:id — CUSTOMER / INSTRUCTOR
const getOrderById = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orderId = req.params.id as string;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Enrollment ID is required" });
    }

    const order = await orderService.getOrderById(orderId, user.id, user.role);

    res.status(200).json({
      success: true,
      message: "Enrollment retrieved successfully",
      data: order,
    });
  } catch (error: any) {
    const statusCode = error.message === "Enrollment not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to retrieve enrollment",
    });
  }
};

export const orderController = {
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getMyOrders,
  getAllOrdersForAdmin,
  getOrderById,
};
