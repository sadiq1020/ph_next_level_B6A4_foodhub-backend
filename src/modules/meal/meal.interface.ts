export interface IMealFilters {
  categoryId?: string | undefined;
  dietary?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  search?: string | undefined;
  providerId?: string | undefined;
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
