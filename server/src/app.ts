import { Hono } from 'hono';
import { logger } from './middleware/logger.js';
import { securityHeaders } from './middleware/security.js';
import { errorHandler } from './middleware/error-handler.js';
import { indexRouter } from './routes/index.js';
import { apiRouter } from './routes/api.js';
import { usersRouter } from './routes/users.js';

// Create the main Hono app
const app = new Hono();

// Apply global middleware
app.use('*', logger());
app.use('*', securityHeaders());
app.use('*', errorHandler());

// Register routes
app.route('/', indexRouter);
app.route('/v1/api', apiRouter);
app.route('/v1/users', usersRouter);

// 404 handler
app.notFound((c) => {
  return c.json({
    status: 404,
    message: 'Not Found',
  }, 404);
});

export { app };