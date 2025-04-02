import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import { app } from './app.js';
import { connectToDatabase, disconnectFromDatabase } from '../prisma/init.js';

// Load environment variables
dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Connect to database and start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Start HTTP server
    console.log(`🚀 Server is running on http://localhost:${port}`);
    
    const server = serve({
      fetch: app.fetch,
      port
    });
    
    // Handle graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down server...');
      server.close();
      await disconnectFromDatabase();
      process.exit(0);
    };
    
    // Listen for termination signals
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    
  } catch (error) {
    console.error('Failed to start server:', error);
    await disconnectFromDatabase();
    process.exit(1);
  }
}

startServer();