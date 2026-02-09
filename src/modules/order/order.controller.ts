import { Request, Response } from "express";
// import { AuthRequest } from '@/app/middlewares/auth.middleware';
import { orderService } from "./order.service";

/**
 * Create a new order
 * POST /api/orders
 * Auth: Customer only
 */
const createOrder = async (req: Request, res: Response) => {
  try {
    const { deliveryAddress, phone, notes, items } = req.body;
    const customerId = req.user!.id; // From auth middleware

    // Validate required fields
    if (!deliveryAddress || !phone || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Delivery address, phone, and items are required",
      });
    }

    // Create order
    const order = await orderService.createOrder({
      customerId,
      deliveryAddress,
      phone,
      notes,
      items,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

/**
 * Update order status
 * PUT /api/orders/:id/status
 * Auth: Provider only
 */
const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const orderId = req.params.id;
    const { status } = req.body;

    // Validate required fields
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // Update order status
    const order = await orderService.updateOrderStatus(
      orderId,
      status,
      user.id,
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error: any) {
    console.error("Update order status error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};

/**
 * Cancel order
 * PUT /api/orders/:id/cancel
 * Auth: Customer only
 */
const cancelOrder = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const orderId = req.params.id;

    // Validate required fields
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Cancel order
    const order = await orderService.cancelOrder(orderId, user.id);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error: any) {
    console.error("Cancel order error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to cancel order",
    });
  }
};

/**
 * Get my orders
 * GET /api/orders
 * Auth: Customer only
 */
const getMyOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Get all orders for this customer
    const orders = await orderService.getMyOrders(user.id);

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error: any) {
    console.error("Get my orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve orders",
    });
  }
};

/**
 * Get all orders (Admin only)
 * GET /api/orders/admin/all
 * Auth: Admin only
 */
const getAllOrdersForAdmin = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Get all orders from all customers
    const orders = await orderService.getAllOrdersForAdmin();

    res.status(200).json({
      success: true,
      message: "All orders retrieved successfully",
      data: orders,
      total: orders.length,
    });
  } catch (error: any) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve orders",
    });
  }
};

export const orderController = {
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getMyOrders,
  getAllOrdersForAdmin,
};
