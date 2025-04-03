import bcrypt from 'bcryptjs';
import { prisma } from '../../prisma/client.js';
import { AppError } from '../middleware/error-handler.js';
import { sign, verify } from 'hono/jwt';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../constants/index.js';

export interface AuthUser {
    id: string;
    email: string;
    name: string | null;
    role: string;
}

export class AuthService {
    async register(email: string, password: string, name: string): Promise<AuthUser> {
        const userExists = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (userExists) {
            throw new AppError('User already exists with this email');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                profile: {
                    create: {},
                },
            },
        });

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }

    async login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new AppError('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password');
        }

        const token = await this.generateToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token,
        };
    }

    async getUserById(userId: string): Promise<AuthUser> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }

    async generateToken(userId: string): Promise<string> {
        return await sign(
            { userId, exp: Math.floor(Date.now() / 1000) + 60 * (Number(JWT_EXPIRES_IN) * 60 * 24) },
            JWT_SECRET,
        );
    }

    async verifyToken(token: string): Promise<{ userId: string }> {
        try {
            const payload = await verify(token, JWT_SECRET);
            return { userId: payload.userId as string };
        } catch (error) {
            throw new AppError('Invalid or expired token', 401);
        }
    }

    async requestPasswordReset(email: string): Promise<void> {
        // pore korbo
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        // pore korbo
    }
}
