import type { Context } from 'hono';
import { AuthService } from '../services/auth-service.js';
import { createSuccessResponse } from '../utils/response.js';
import { AppError } from '../middleware/error-handler.js';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();

        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.getCurrentUser = this.getCurrentUser.bind(this);
    }

    async register(c: Context) {
        try {
            const { email, password, name } = c.req.valid('json' as never);

            const user = await this.authService.register(email, password, name);
            return c.json(createSuccessResponse({ user }), 201);
        } catch (error) {
            throw error;
        }
    }

    async login(c: Context) {
        try {
            const { email, password } = c.req.valid('json' as never);
            const { user, token } = await this.authService.login(email, password);

            c.header('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`);

            return c.json(createSuccessResponse({ user }), 200);
        } catch (error) {
            throw error;
        }
    }

    logout = async (c: Context) => {
        c.header('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');

        return c.json(createSuccessResponse({ message: 'Logged out successfully' }));
    };

    getCurrentUser = async (c: Context) => {
        const userId = c.get('userId');

        if (!userId) {
            throw new AppError('Unauthorized', 401);
        }

        const user = await this.authService.getUserById(userId);

        return c.json(createSuccessResponse({ user }));
    };
}
