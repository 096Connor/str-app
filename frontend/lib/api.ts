// lib/api.ts - DODAJ DO ISTNIEJĄCEGO PLIKU
import axios from 'axios';
import { AuthResponse, LoginData, RegisterData, User } from '@/types/auth';
import { Movie, CreateMovieData } from '@/types/movie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor - dodaje token do każdego requesta
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH API
export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// MOVIES API
export const moviesAPI = {
  getAll: async (genre?: string, search?: string): Promise<Movie[]> => {
    const params = new URLSearchParams();
    if (genre) params.append('genre', genre);
    if (search) params.append('search', search);
    
    const response = await api.get<Movie[]>(`/movies?${params.toString()}`);
    return response.data;
  },

  getOne: async (id: string): Promise<Movie> => {
    const response = await api.get<Movie>(`/movies/${id}`);
    return response.data;
  },

  create: async (data: CreateMovieData): Promise<Movie> => {
    const response = await api.post<Movie>('/movies', data);
    return response.data;
  },

  seed: async (): Promise<{ message: string; count: number }> => {
    const response = await api.get('/movies/seed');
    return response.data;
  },
};

export default api;
