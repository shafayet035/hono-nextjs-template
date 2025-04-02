import type { Context } from 'hono';
import { AppError } from '../middleware/error-handler.js';

const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
];

export class UserController {
  getAllUsers = async (c: Context) => {
    return c.json({
      success: true,
      data: users
    });
  };

  getUserById = async (c: Context) => {
    const id = c.req.param('id');
    const user = users.find(u => u.id === id);
    
    if (!user) {
      throw new AppError(`User with ID ${id} not found`, 404);
    }
    
    return c.json({
      success: true,
      data: user
    });
  };

  createUser = async (c: Context) => {
    try {
      const body = await c.req.json();
      
      // Validate input
      if (!body.name || !body.email) {
        throw new AppError('Name and email are required', 400);
      }
      
      // Create a new user (in a real app, save to database)
      const newUser = {
        id: (users.length + 1).toString(),
        name: body.name,
        email: body.email
      };
      
      users.push(newUser);
      
      return c.json({
        success: true,
        data: newUser
      }, 201);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new AppError('Invalid JSON in request body', 400);
      }
      throw error;
    }
  };

  updateUser = async (c: Context) => {
    const id = c.req.param('id');
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw new AppError(`User with ID ${id} not found`, 404);
    }
    
    try {
      const body = await c.req.json();
      
      // Update user (in a real app, update in database)
      users[userIndex] = {
        ...users[userIndex],
        ...body
      };
      
      return c.json({
        success: true,
        data: users[userIndex]
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new AppError('Invalid JSON in request body', 400);
      }
      throw error;
    }
  };

  deleteUser = async (c: Context) => {
    const id = c.req.param('id');
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw new AppError(`User with ID ${id} not found`, 404);
    }
    
    // Remove user (in a real app, delete from database)
    const deletedUser = users.splice(userIndex, 1)[0];
    
    return c.json({
      success: true,
      data: deletedUser
    });
  };
}