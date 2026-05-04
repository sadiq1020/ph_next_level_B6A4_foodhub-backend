export interface ICourseFilters {
  categoryId?: string | undefined;
  difficulty?: string | undefined;   // BEGINNER | INTERMEDIATE | ADVANCED
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  search?: string | undefined;
  instructorId?: string | undefined;
}

export interface ICreateCourse {
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  instructorId: string;
  tags?: string[];
  // ── Course-specific fields ────────────────────────────
  videoUrl?: string;
  duration?: number;      // total minutes
  difficulty?: string;    // BEGINNER | INTERMEDIATE | ADVANCED
  lessonsCount?: number;
  // ─────────────────────────────────────────────────────
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
