import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: 'USER' | 'ADMIN' | 'OPERATOR';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null; // Timestamp in ms
  isAuthenticated: boolean;
  isLoading: boolean;

  setSession: (session: {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // Seconds
  }) => void;
  
  logout: () => void;
  setLoading: (loading: boolean) => void;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,
      isLoading: false,

      setSession: ({ user, accessToken, refreshToken, expiresIn }) => {
        const expiresAt = Date.now() + expiresIn * 1000;
        set({
          user,
          accessToken,
          refreshToken,
          expiresAt,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),

      isTokenExpired: () => {
        const { expiresAt } = get();
        if (!expiresAt) return true;
        // Check if token expires in the next 30 seconds
        return Date.now() > (expiresAt - 30000);
      },
    }),
    {
      name: 'metro-auth-storage',
      // Only persist specific keys
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
