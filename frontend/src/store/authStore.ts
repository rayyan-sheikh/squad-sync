import { create } from 'zustand';
import { toast } from 'sonner';
import api, { authApi, setAccessTokenGetter, type AuthUser } from '../api/auth.api';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isInitializing: boolean;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  isInitializing: true,

  setAccessToken: (token) => set({ accessToken: token }),

  clearAuth: () => set({ user: null, accessToken: null }),

  register: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.register(email, password);
      set({ user: data.user, accessToken: data.accessToken });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.login(email, password);
      set({ user: data.user, accessToken: data.accessToken });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, accessToken: null });
  },

  // Called once on app mount — rehydrates session from refresh cookie
  initialize: async () => {
    try {
      const { data: refreshData } = await authApi.refresh();
      set({ accessToken: refreshData.accessToken });
      const { data: meData } = await authApi.me();
      set({ user: meData.user });
    } catch {
      set({ user: null, accessToken: null });
    } finally {
      set({ isInitializing: false });
    }
  },
}));

// Wire access token getter into the axios request interceptor
setAccessTokenGetter(() => useAuthStore.getState().accessToken);

// 401 response interceptor — silently refresh and retry once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    const isAuthEndpoint = original?.url?.includes('/auth/refresh') ||
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/register');

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        const { data } = await authApi.refresh();
        useAuthStore.getState().setAccessToken(data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        useAuthStore.getState().clearAuth();
        toast.error('Session expired. Please sign in again.');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);
