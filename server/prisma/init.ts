import { prisma } from './client.js';

export async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to MongoDB database');
    
    return prisma;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB database:', error);
    process.exit(1);
  }
}

export async function disconnectFromDatabase() {
  try {
    await prisma.$disconnect();
    console.log('Disconnected from MongoDB database');
  } catch (error) {
    console.error('Error disconnecting from MongoDB database:', error);
    process.exit(1);
  }
}