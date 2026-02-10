export interface ICreateReview {
  mealId: string;
  customerId: string;
  rating: number; // 1-5
  comment?: string;
}
