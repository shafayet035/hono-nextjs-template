import { prisma } from './client.js';

export async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database');
    
    return prisma;
  } catch (error) {
    console.error('❌ Error connecting to PostgreSQL database:', error);
    process.exit(1);
  }
}

export async function disconnectFromDatabase() {
  try {
    await prisma.$disconnect();
    console.log('Disconnected from PostgreSQL database');
  } catch (error) {
    console.error('Error disconnecting from PostgreSQL database:', error);
    process.exit(1);
  }
}