import type { MiddlewareHandler, Context } from 'hono';
import { AppError } from './error-handler.js';

interface RateLimitRecord {
    count: number;
    resetTime: number;
}

const ipRequests = new Map<string, RateLimitRecord>();

export const rateLimit = (
    options: {
        windowMs?: number;
        max?: number;
        message?: string;
        statusCode?: number;
        keyGenerator?: (c: Context) => string;
    } = {},
): MiddlewareHandler => {
    const {
        windowMs = 60 * 1000, // 1 minute default
        max = 30, // 60 requests per minute default
        message = 'Too many requests, please try again later',
        statusCode = 429, // Too Many Requests
        keyGenerator = (c: Context) =>
            c.req.header('x-forwarded-for') || c.env.incoming?.[0]?.client?.remoteAddress || 'unknown',
    } = options;

    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of ipRequests.entries()) {
            if (now > record.resetTime) {
                ipRequests.delete(key);
            }
        }
    }, windowMs);

    return async (c: Context, next) => {
        const key = keyGenerator(c);
        const now = Date.now();

        let record = ipRequests.get(key);

        if (!record) {
            // First request from this IP
            record = {
                count: 1,
                resetTime: now + windowMs,
            };
            ipRequests.set(key, record);
        } else if (now > record.resetTime) {
            // Reset window has passed
            record.count = 1;
            record.resetTime = now + windowMs;
        } else if (record.count < max) {
            // Increment request count
            record.count++;
        } else {
            // Too many requests
            // Set headers for rate limiting info
            c.header('X-RateLimit-Limit', max.toString());
            c.header('X-RateLimit-Remaining', '0');
            c.header('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000).toString());
            c.header('Retry-After', Math.ceil((record.resetTime - now) / 1000).toString());

            throw new AppError(message, statusCode);
        }

        // Set headers for rate limiting info
        c.header('X-RateLimit-Limit', max.toString());
        c.header('X-RateLimit-Remaining', (max - record.count).toString());
        c.header('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000).toString());

        await next();
    };
};

export const authRateLimit = (): MiddlewareHandler => {
    return rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10, // 10 requests per 15 minutes
        message: 'Too many login attempts, please try again later',
        keyGenerator: (c: Context) => {
            // Use IP address and path for more granular control
            const ip = c.req.header('x-forwarded-for') || c.env.incoming?.[0]?.client?.remoteAddress || 'unknown';
            const path = new URL(c.req.url).pathname;
            return `${ip}:${path}`;
        },
    });
};
