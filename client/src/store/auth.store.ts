import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api';
import { LoginData, RegisterData, User, ApiResponse } from '@/types';
import { toast } from 'sonner';

interface AuthState {
    // State
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    fetchCurrentUser: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                // Initial state
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,

                // Actions
                login: async (payload: LoginData) => {
                    try {
                        set({ isLoading: true, error: null });
                        const { data } = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
                            '/auth/login',
                            payload,
                        );

                        if (data.success) {
                            set({
                                user: data.data?.user,
                                isAuthenticated: true,
                                isLoading: false,
                            });
                        } else {
                            toast('Something Went Wrong');
                        }
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : 'Login failed',
                            isLoading: false,
                        });
                        throw error;
                    }
                },

                register: async (payload: RegisterData) => {
                    try {
                        set({ isLoading: true, error: null });
                        const { data } = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
                            '/auth/register',
                            payload,
                        );

                        if (data.success) {
                            set({
                                user: data.data?.user,
                                isAuthenticated: true,
                                isLoading: false,
                            });
                        }
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : 'Registration failed',
                            isLoading: false,
                        });
                        throw error;
                    }
                },

                logout: async () => {
                    try {
                        set({ isLoading: true });
                        await apiClient.post<ApiResponse<null>>('/auth/logout');
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                        });
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : 'Logout failed',
                            isLoading: false,
                        });
                    }
                },

                fetchCurrentUser: async () => {
                    try {
                        set({ isLoading: true });
                        const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');

                        if (data.success) {
                            set({
                                user: data.data,
                                isAuthenticated: true,
                                isLoading: false,
                            });
                        } else {
                            set({
                                user: null,
                                isAuthenticated: false,
                                isLoading: false,
                            });
                        }
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (_err) {
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                        });
                    }
                },

                clearError: () => {
                    set({ error: null });
                },
            }),
            {
                name: 'auth-storage',
                partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
            },
        ),
    ),
);
