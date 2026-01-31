export interface ICreateOrder {
    customerId: string;
    deliveryAddress: string;
    phone: string;
    notes?: string;
    items: Array<{
        mealId: string;
        quantity: number;
    }>;
}