import { prisma } from "../../lib/prisma"
import { ICreateOrder } from "./order.interface";

// create new category
const createOrder = async (data: ICreateOrder) => {
    const result = await prisma.order.create({
        data
    })
    return result;
}

export const categoryOrder = {
    createOrder
}