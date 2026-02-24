export interface ICreateCategory {
  name: string;
  slug: string; // ✅ Add slug
  image?: string;
}

export interface IUpdateCategory {
  name?: string;
  slug?: string; // ✅ Add slug
  image?: string;
}
