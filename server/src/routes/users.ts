import { Hono } from 'hono';
import { UserController } from '../controllers/user-controller.js';

const usersRouter = new Hono();
const userController = new UserController();

// Get all users
usersRouter.get('/', userController.getAllUsers);

// Get user by ID
usersRouter.get('/:id', userController.getUserById);

// Create new user
usersRouter.post('/', userController.createUser);

// Update user
usersRouter.put('/:id', userController.updateUser);

// Delete user
usersRouter.delete('/:id', userController.deleteUser);

export { usersRouter };