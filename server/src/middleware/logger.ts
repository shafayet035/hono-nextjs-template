import type { Context, MiddlewareHandler } from 'hono';

export const logger = (): MiddlewareHandler => {
  return async (c: Context, next) => {
    const start = Date.now();
    const method = c.req.method;
    const url = c.req.url;
    
    try {
      await next();
      
      const end = Date.now();
      const responseTime = end - start;
      const status = c.res.status;
      
      console.log(
        `[${new Date().toISOString()}] ${method} ${url} ${status} - ${responseTime}ms`
      );
    } catch (error) {
      const end = Date.now();
      const responseTime = end - start;
      
      console.error(
        `[${new Date().toISOString()}] ${method} ${url} ERROR - ${responseTime}ms`
      );
      console.error(error);
      throw error;
    }
  };
};