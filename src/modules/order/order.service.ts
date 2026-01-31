import { prisma } from "../../lib/prisma";
import { ICreateOrder } from "./order.interface";
import { generateOrderNumber } from "./order.utils";

const createOrder = async (data: ICreateOrder) => {
    // 1. Fetch meal prices from database (don't trust frontend prices!)
    const mealIds = data.items.map(item => item.mealId);
    const meals = await prisma.meal.findMany({
        where: { id: { in: mealIds } }
    });

    // 2. Calculate subtotal (price * quantity for each item)
    let subtotal = 0;
    const orderItemsData = data.items.map(item => {
        const meal = meals.find(m => m.id === item.mealId);
        if (!meal) throw new Error(`Meal ${item.mealId} not found`);

        const itemTotal = meal.price as any * item.quantity;
        subtotal += itemTotal;

        return {
            mealId: item.mealId,
            quantity: item.quantity,
            price: meal.price // Save price at time of order
        };
    });

    // 3. Add delivery fee
    const deliveryFee = 50;
    const total = subtotal + deliveryFee;

    // 4. Generate unique order number
    const orderNumber = generateOrderNumber(); // from order.utils.ts

    // 5. Create Order AND OrderItems in a TRANSACTION
    // This ensures both are created together or neither is created
    const order = await prisma.$transaction(async (tx) => {
        // Create the Order
        const newOrder = await tx.order.create({
            data: {
                orderNumber,
                customerId: data.customerId,
                deliveryAddress: data.deliveryAddress,
                phone: data.phone,
                notes: data.notes ?? null,
                subtotal,
                deliveryFee,
                total,
                status: 'PLACED',
            }
        });

        // Create all OrderItems
        await tx.orderItem.createMany({
            data: orderItemsData.map(item => ({
                orderId: newOrder.id,
                mealId: item.mealId,
                quantity: item.quantity,
                price: item.price,
            }))
        });

        // Return the order with items included
        return tx.order.findUnique({
            where: { id: newOrder.id },
            include: {
                items: {
                    include: {
                        meal: true
                    }
                },
                customer: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
    });

    return order;
};

export const orderService = {
    createOrder
}