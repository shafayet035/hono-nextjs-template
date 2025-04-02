import { Hono } from 'hono';
import { corsMiddleware } from '../middleware/security.js';

const apiRouter = new Hono();

// Apply CORS middleware specifically for API routes
apiRouter.use('*', corsMiddleware({
    // Change CORS Later
  origin: ["*"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

apiRouter.get('/', (c) => {
  return c.json({
    message: 'API endpoints',
    endpoints: [
      '/api',
      '/api/status'
    ]
  });
});

apiRouter.get('/status', (c) => {
  return c.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

export { apiRouter };