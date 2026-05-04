export const ROLES = {
  CUSTOMER:   "CUSTOMER",
  INSTRUCTOR: "INSTRUCTOR",  // was: PROVIDER
  ADMIN:      "ADMIN",
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];