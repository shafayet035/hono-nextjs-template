import { jwt } from 'hono/jwt';
import { JWT_SECRET } from '../constants/index.js';
import type { Context, MiddlewareHandler } from 'hono';
import { AppError } from './error-handler.js';

export const jwtMiddleWare = jwt({
    secret: JWT_SECRET,
    cookie: 'token',
});

export const authMiddleware = (): MiddlewareHandler => {
    return async (c: Context, next) => {
        try {
            await jwtMiddleWare(c, async () => {
                const payload = c.get('jwtPayload');
                if (!payload || !payload.userId) {
                    throw new AppError('Invalid Token Payload', 401);
                }

                c.set('userId', payload.userId);
            });

            await next();
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Unauthorized', 401);
        }
    };
};
