export interface ICreateProviderProfile {
  businessName: string;
  description?: string;
  address: string;
  logo?: string;
  userId: string;
}

export interface IUpdateProviderProfile {
  businessName?: string;
  description?: string;
  address?: string;
  logo?: string;
}
