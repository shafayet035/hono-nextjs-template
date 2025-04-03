import { Hono } from 'hono';
import { AuthController } from '../controllers/auth-controller.js';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, registerSchema } from '../validation/auth-validation.js';
import { authMiddleware } from '../middleware/auth-middleware.js';

const authRouter = new Hono();
const authController = new AuthController();

authRouter.post('/register', zValidator('json', registerSchema), authController.register);
authRouter.post('/login', zValidator('json', loginSchema), authController.login);
authRouter.post('/logout', authController.logout);

authRouter.get('/me', authMiddleware(), authController.getCurrentUser);

export { authRouter };
