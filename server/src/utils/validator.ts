import { ZodSchema } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { ValidationTargets } from 'hono';

/**
 * Custom Zod validator with consistent error handling
 *
 * @param target The validation target ('json', 'form', 'query', etc.)
 * @param schema The Zod schema to validate against
 * @returns A middleware that validates the request and handles errors consistently
 */

export const zodValidator = <T extends ZodSchema>(target: keyof ValidationTargets, schema: T) => {
    return zValidator(target, schema, (result, c) => {
        if (!result.success) {
            return c.json(
                {
                    success: false,
                    message: 'Validation Failed',
                    errors: result.error.issues.map((issue) => ({
                        path: issue.path.join('.'),
                        message: issue.message,
                    })),
                },
                200,
            );
        }
    });
};
