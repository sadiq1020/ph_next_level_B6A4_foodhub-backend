export interface IMealFilters {
  categoryId?: string;
  dietary?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  providerId?: string;
}

export interface ICreateMeal {
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  providerId: string;
  dietary?: string[];
  spiceLevel?: number;
}

export interface IUpdateMeal {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  isAvailable?: boolean;
  categoryId?: string;
  dietary?: string[];
  spiceLevel?: number;
}
