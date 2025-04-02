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
    c.res.headers.set('Content-Security-Policy', "default-src 'self'");
    c.res.headers.set('Referrer-Policy', 'no-referrer-when-downgrade');
    c.res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  };
};

export const corsMiddleware = (options?: cors.CorsOptions): MiddlewareHandler => {
  const defaultOptions: cors.CorsOptions = {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: [],
    credentials: false,
    maxAge: 86400,
  };

  const opts = { ...defaultOptions, ...options };
  
  return async (c: Context, next) => {
    const origin = c.req.header('Origin');
    if (origin) {
      c.res.headers.set('Access-Control-Allow-Origin', origin);
      c.res.headers.set('Access-Control-Allow-Methods', Array.isArray(opts.methods) ? opts.methods.join(',') : opts.methods || '');
      c.res.headers.set('Access-Control-Allow-Headers', Array.isArray(opts.allowedHeaders) ? opts.allowedHeaders.join(',') : opts.allowedHeaders || '');
      c.res.headers.set('Access-Control-Max-Age', opts.maxAge?.toString() || '86400');
      if (opts.credentials) {
        c.res.headers.set('Access-Control-Allow-Credentials', 'true');
      }
    }
    
    if (c.req.method === 'OPTIONS') {
      return c.newResponse(null, 204);
    }
    
    await next();
  };
};