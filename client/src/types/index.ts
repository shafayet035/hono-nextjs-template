export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
}

export interface Profile {
    id: string;
    bio?: string;
    avatar?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: number;
        message: string;
    };
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        timestamp: string;
    };
}
