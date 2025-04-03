import type { Context, MiddlewareHandler } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { ZodError } from 'zod';

export class AppError extends Error {
    status: number;

    constructor(message: string, status = 500) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const errorHandler = (): MiddlewareHandler => {
    return async (c: Context, next) => {
        try {
            await next();
        } catch (error) {
            console.error('Error caught in error handler:', error);

            if (error instanceof ZodError) {
                const formatError = error.errors.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));

                return c.json(
                    {
                        status: 400,
                        messsage: 'Validation error',
                        errors: formatError,
                    },
                    400,
                );
            }

            if (error instanceof AppError) {
                return c.json(
                    {
                        status: error.status,
                        message: error.message,
                    },
                    error.status as ContentfulStatusCode,
                );
            }

            // For other types of errors
            return c.json(
                {
                    status: 500,
                    message: 'Internal Server Error',
                },
                500,
            );
        }
    };
};
