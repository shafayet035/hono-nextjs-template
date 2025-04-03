import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => config,
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const { response } = error;

        if (response?.status === 401) {
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        if (response) {
            const errorMessage = (response.data as { message: string })?.message || 'An error occurred';
            toast(errorMessage);
        } else {
            toast('Unable to connect to the server');
        }

        return Promise.reject(error);
    },
);
