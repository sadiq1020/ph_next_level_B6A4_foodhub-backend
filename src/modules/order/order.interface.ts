import { OrderStatus } from "../../../generated/prisma";
import { Decimal } from "../../../generated/prisma/runtime/client";

export interface ICreateOrder {
    orderNumber: string;
    customerId: string;
    deliveryAddress: string;
    phone: string;
    notes?: string;
    subtotal: Decimal;
    deliveryFee: Decimal;
    total: Decimal;
    status: OrderStatus;
}