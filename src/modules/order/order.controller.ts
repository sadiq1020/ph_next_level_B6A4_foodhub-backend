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

export const orderController = {
  createOrder,
  updateOrderStatus,
};
