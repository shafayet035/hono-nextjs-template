import type { Context, MiddlewareHandler } from 'hono';
import { ZodError } from 'zod';
import { createErrorResponse } from '../utils/response.js';
import type { HTTPException } from 'hono/http-exception';

export class AppError extends Error {
    status: number;
    name: string = 'AppError';

    constructor(message: string, status = 400) {
        super(message);
        this.name = 'AppError';
        this.status = status;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
export const errorHandler = () => {
    return (err: Error | HTTPException, c: Context) => {
        console.error('Global error handler caught:', err);

        // Handle Zod validation errors
        if (err instanceof ZodError) {
            const formattedErrors = err.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
            }));

            return c.json(createErrorResponse('Validation error', formattedErrors), 200);
        }

        // Handle our custom AppError
        if (err instanceof AppError) {
            console.log('AppError detected:', err.message);
            return c.json(createErrorResponse(err.message), 200);
        }

        // For any other errors
        console.error('Unexpected error:', err);
        return c.json(createErrorResponse('Internal Server Error'), 500);
    };
};
