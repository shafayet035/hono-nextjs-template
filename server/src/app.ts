import { Hono, type Context } from 'hono';
import { logger } from './middleware/logger.js';
import { securityHeaders } from './middleware/security.js';
import { AppError, errorHandler } from './middleware/error-handler.js';
import { indexRouter } from './routes/index.js';
import { apiRouter } from './routes/api.js';
import { authRouter } from './routes/auth.js';
import { createErrorResponse } from './utils/response.js';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';

// Create the main Hono app
const app = new Hono();

// Apply global middleware
app.use('*', logger());

app.onError(errorHandler());

app.use('*', securityHeaders());

// Register routes
app.route('/', indexRouter);
app.route('/v1/api', apiRouter);
app.route('/v1/auth', authRouter);

// 404 handler
app.notFound((c) => {
    return c.json(
        {
            status: 404,
            message: 'Not Found',
        },
        404,
    );
});

export { app };
