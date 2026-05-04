export interface ICreateInstructorProfile {
  businessName: string;
  description?: string;
  address: string;
  logo?: string;
  userId: string;
  // status is NOT here — always set server-side to PENDING
}

export interface IUpdateInstructorProfile {
  businessName?: string;
  description?: string;
  address?: string;
  logo?: string;
}