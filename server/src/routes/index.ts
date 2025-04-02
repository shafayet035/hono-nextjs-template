import { Hono } from 'hono';

const indexRouter = new Hono();

indexRouter.get('/', (c) => {
  return c.json({
    message: 'Welcome to Hono with Node.js API!',
    version: '1.0.0'
  });
});

indexRouter.get('/health', (c) => {
  return c.json({
    status: 'All good baby!',
    timestamp: new Date().toISOString()
  });
});

export { indexRouter };