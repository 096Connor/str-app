// lib/api.ts - DODAJ DO ISTNIEJĄCEGO PLIKU
import axios from "axios";
import { AuthResponse, LoginData, RegisterData, User } from "@/types/auth";
import { Movie, CreateMovieData } from "@/types/movie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor - dodaje token do każdego requesta
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH API
export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  }
};

// MOVIES API
export const moviesAPI = {
  getAll: async (genre?: string, search?: string): Promise<Movie[]> => {
    const params = new URLSearchParams();
    if (genre) params.append("genre", genre);
    if (search) params.append("search", search);

    const response = await api.get<Movie[]>(`/movies?${params.toString()}`);
    return response.data;
  },

  getOne: async (id: string): Promise<Movie> => {
    const response = await api.get<Movie>(`/movies/${id}`);
    return response.data;
  },

  create: async (data: CreateMovieData): Promise<Movie> => {
    const response = await api.post<Movie>("/movies", data);
    return response.data;
  },

  seed: async (): Promise<{ message: string; count: number }> => {
    const response = await api.get("/movies/seed");
    return response.data;
  }
};
// WATCHLIST API
export const watchlistAPI = {
  getAll: async () => {
    const response = await api.get("/watchlist");
    return response.data;
  },
  add: async (movieId: string) => {
    const response = await api.post("/watchlist", { movieId });
    return response.data;
  },
  remove: async (movieId: string) => {
    const response = await api.delete(`/watchlist/${movieId}`);
    return response.data;
  },
  check: async (movieId: string): Promise<boolean> => {
    const response = await api.get(`/watchlist/${movieId}/check`);
    return response.data;
  }
};
// HISTORY API
export const historyAPI = {
  getAll: async () => {
    const response = await api.get("/history");
    return response.data;
  },
  getCompleted: async () => {
    const response = await api.get("/history/completed");
    return response.data;
  },
  add: async (movieId: string) => {
    const response = await api.post("/history", { movieId });
    return response.data;
  },
  markCompleted: async (movieId: string) => {
    const response = await api.patch(`/history/${movieId}/complete`);
    return response.data;
  },
  clear: async () => {
    const response = await api.delete("/history");
    return response.data;
  }
};

// RECOMMENDATIONS API
export const recommendationsAPI = {
  getAll: async (): Promise<Movie[]> => {
    const response = await api.get("/movies/recommendations");
    return response.data;
  }
};

// PAYMENTS API
export const paymentsAPI = {
  createCheckout: async () => {
    const response = await api.post("/payments/checkout");
    return response.data;
  },
  getStatus: async () => {
    const response = await api.get("/payments/status");
    return response.data;
  }
};

export default api;
