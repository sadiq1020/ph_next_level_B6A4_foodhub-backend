export interface IUserFilters {
  role?: string; // Filter by role (CUSTOMER, PROVIDER, ADMIN)
  isActive?: boolean; // Filter by active status
  search?: string; // Search by name or email
}
