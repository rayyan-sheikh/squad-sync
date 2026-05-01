import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  withCredentials: true,
});

export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user: AuthUser;
  accessToken: string;
}

// Set by authStore after creation — avoids circular imports
let getAccessToken: () => string | null = () => null;
export const setAccessTokenGetter = (fn: () => string | null) => {
  getAccessToken = fn;
};

// Attach access token to every outgoing request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { email, password }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  refresh: () =>
    api.post<{ success: boolean; accessToken: string }>('/auth/refresh'),

  logout: () =>
    api.post('/auth/logout'),

  me: () =>
    api.get<{ success: boolean; user: AuthUser }>('/auth/me'),
};

export default api;
