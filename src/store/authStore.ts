import { create } from 'zustand';
import { authApi } from '@/lib/api';

interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: true,

    login: async (email: string, password: string) => {
        const data = await authApi.login(email, password);
        set({
            user: data.user,
            token: data.access_token,
            isLoading: false
        });
    },

    register: async (email: string, password: string) => {
        const data = await authApi.register(email, password).then(res => res.data);
        set({
            user: data.user,
            token: data.access_token,
            isLoading: false
        });
    },

    logout: () => {
        authApi.logout();
        set({ user: null, token: null });
    },

    checkAuth: async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await authApi.getProfile();
                set({ user: response.data, token, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            set({ user: null, token: null, isLoading: false });
        }
    },
}));