export interface ICourseFilters {
  categoryId?: string | undefined;
  difficulty?: string | undefined;   // BEGINNER | INTERMEDIATE | ADVANCED
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  search?: string | undefined;
  instructorId?: string | undefined;
  // ── New: sorting + pagination ─────────────────────────
  sort?: string | undefined;         // newest | price_asc | price_desc | most_reviewed
  page?: number | undefined;         // 1-based
  limit?: number | undefined;        // default 12
}

export interface ICreateCourse {
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  instructorId: string;
  tags?: string[];
  videoUrl?: string;
  duration?: number;
  difficulty?: string;
  lessonsCount?: number;
}

export interface IUpdateCourse {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  isAvailable?: boolean;
  categoryId?: string;
  tags?: string[];
  videoUrl?: string;
  duration?: number;
  difficulty?: string;
  lessonsCount?: number;
}