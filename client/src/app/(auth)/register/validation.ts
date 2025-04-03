import { z } from 'zod';

export const registerSchema = z
    .object({
        name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
        email: z.string().email({ message: 'Please enter a valid email address' }),
        password: z
            .string()
            .min(8, {
                message: 'Password must be at least 8 characters',
            })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;
