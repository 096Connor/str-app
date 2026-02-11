// types/movie.ts
export interface Movie {
  id: string;
  title: string;
  description?: string;
  releaseYear: number;
  duration: number;
  genre: string[];
  thumbnail: string;
  videoUrl: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMovieData {
  title: string;
  description?: string;
  releaseYear: number;
  duration: number;
  genre: string[];
  thumbnail: string;
  videoUrl: string;
  rating?: number;
}
