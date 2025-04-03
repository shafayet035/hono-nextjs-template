import type { Context, MiddlewareHandler } from 'hono';
import cors from 'cors';

export const securityHeaders = (): MiddlewareHandler => {
    return async (c: Context, next) => {
        // Apply security headers before the response
        await next();

        // Set security headers
        c.res.headers.set('X-Content-Type-Options', 'nosniff');
        c.res.headers.set('X-Frame-Options', 'DENY');
        c.res.headers.set('X-XSS-Protection', '1; mode=block');
        c.res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        // Modify Content-Security-Policy to be less restrictive for development
        if (process.env.NODE_ENV === 'production') {
            c.res.headers.set('Content-Security-Policy', "default-src 'self'");
        }

        c.res.headers.set('Referrer-Policy', 'no-referrer-when-downgrade');
        c.res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    };
};

export const corsMiddleware = (options?: cors.CorsOptions): MiddlewareHandler => {
    const defaultOptions: cors.CorsOptions = {
        origin: ['http://localhost:3001', 'http://localhost:5173', 'http://127.0.0.1:5173'],
        methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Set-Cookie'],
        credentials: true,
        maxAge: 86400,
    };

    const opts = { ...defaultOptions, ...options };

    return async (c: Context, next) => {
        const origin = c.req.header('Origin');

        // Handle preflight OPTIONS request
        if (c.req.method === 'OPTIONS') {
            // Set CORS headers for preflight response
            if (origin) {
                // Check if the origin is allowed
                let allowOrigin = '*';
                if (opts.credentials) {
                    // For credentials mode, we can't use wildcard
                    const allowedOrigins = Array.isArray(opts.origin) ? opts.origin : [opts.origin];
                    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
                        allowOrigin = origin;
                    }
                } else if (Array.isArray(opts.origin) && !opts.origin.includes('*') && opts.origin.includes(origin)) {
                    allowOrigin = origin;
                } else if (opts.origin === origin || opts.origin === '*') {
                    allowOrigin = origin;
                }

                c.res.headers.set('Access-Control-Allow-Origin', allowOrigin);
                c.res.headers.set(
                    'Access-Control-Allow-Methods',
                    Array.isArray(opts.methods) ? opts.methods.join(',') : opts.methods || '',
                );
                c.res.headers.set(
                    'Access-Control-Allow-Headers',
                    Array.isArray(opts.allowedHeaders) ? opts.allowedHeaders.join(',') : opts.allowedHeaders || '',
                );
                c.res.headers.set('Access-Control-Max-Age', opts.maxAge?.toString() || '86400');

                if (opts.credentials) {
                    c.res.headers.set('Access-Control-Allow-Credentials', 'true');
                }

                if (opts.exposedHeaders && opts.exposedHeaders.length > 0) {
                    c.res.headers.set(
                        'Access-Control-Expose-Headers',
                        Array.isArray(opts.exposedHeaders) ? opts.exposedHeaders.join(',') : opts.exposedHeaders,
                    );
                }
            }

            return c.newResponse(null, 204);
        }

        // For non-OPTIONS requests, set CORS headers and proceed
        if (origin) {
            let allowOrigin = '*';

            // Same origin checking logic as above
            if (opts.credentials) {
                const allowedOrigins = Array.isArray(opts.origin) ? opts.origin : [opts.origin];
                if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
                    allowOrigin = origin;
                }
            } else if (Array.isArray(opts.origin) && !opts.origin.includes('*') && opts.origin.includes(origin)) {
                allowOrigin = origin;
            } else if (opts.origin === origin || opts.origin === '*') {
                allowOrigin = origin;
            }

            c.res.headers.set('Access-Control-Allow-Origin', allowOrigin);

            if (opts.credentials) {
                c.res.headers.set('Access-Control-Allow-Credentials', 'true');
            }

            if (opts.exposedHeaders && opts.exposedHeaders.length > 0) {
                c.res.headers.set(
                    'Access-Control-Expose-Headers',
                    Array.isArray(opts.exposedHeaders) ? opts.exposedHeaders.join(',') : opts.exposedHeaders,
                );
            }
        }

        await next();
    };
};
