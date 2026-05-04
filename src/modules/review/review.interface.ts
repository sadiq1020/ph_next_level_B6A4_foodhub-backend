export interface ICreateReview {
  customerId: string;
  courseId: string;   // was: mealId
  rating: number;
  comment?: string;
}
