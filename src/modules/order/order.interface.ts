export interface ICreateOrder {
  customerId: string;
  notes?: string;
  items: Array<{
    courseId: string;   // was: mealId
    quantity: number;   // always 1 per course enrollment
  }>;
}
