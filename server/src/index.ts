import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import { app } from './app.js';
import { appConfig } from './config/app-config.js';

// Load environment variables
dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

console.log(`🚀 Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});