export const ORDER_STATUS = {
  PENDING:   "PENDING",
  ACTIVE:    "ACTIVE",
  COMPLETED: "COMPLETED",
  EXPIRED:   "EXPIRED",
  CANCELLED: "CANCELLED",
} as const;
 
export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];