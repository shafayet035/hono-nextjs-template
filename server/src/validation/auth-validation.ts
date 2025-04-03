import { z } from 'zod';

// User registration validation schema
export const registerSchema = z.object({
    email: z.string({ message: 'Invalid email format' }).email('Invalid email format'),
    password: z
        .string({ message: 'Password Required' })
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().optional(),
});

// User login validation schema
export const loginSchema = z.object({
    email: z.string({ message: 'Email Required' }).email('Invalid email format'),
    password: z.string({ message: 'Password Required' }).min(1, 'Password is required'),
});

// Password reset request validation schema
export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email format'),
});

// Password reset validation schema
export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

// Export types from the schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
