import { Hono } from 'hono';
import { logger } from './middleware/logger.js';
import { corsMiddleware, securityHeaders } from './middleware/security.js';
import { errorHandler } from './middleware/error-handler.js';
import { indexRouter } from './routes/index.js';
import { apiRouter } from './routes/api.js';
import { authRouter } from './routes/auth.js';
import { rateLimit } from './middleware/rate-limit.js';

const app = new Hono();

app.use('*', logger());
app.onError(errorHandler());
app.use(corsMiddleware());
app.use('*', securityHeaders());
app.use('*', rateLimit());

app.use(
    '*',
    corsMiddleware({
        origin: ['http://localhost:3001'],
    }),
);

app.route('/', indexRouter);
app.route('/v1/api', apiRouter);
app.route('/v1/auth', authRouter);

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
