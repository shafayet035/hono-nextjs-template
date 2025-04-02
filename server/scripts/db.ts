import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { hash } from 'bcryptjs';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔄 Setting up the database...');
    
    // Check if admin user exists
    const adminExists = await prisma.user.findUnique({
      where: {
        email: 'admin@example.com',
      },
    });
    
    if (!adminExists) {
      // Hash the password (this is just for development, in production use stronger methods)
      const hashedPassword = await hash('adminPassword123', 10);
      
      // Create admin user with Prisma
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'ADMIN',
          profile: {
            create: {
              bio: 'System administrator',
            },
          },
        },
      });
      
      console.log('👤 Created admin user: admin@example.com');
    } else {
      console.log('👤 Admin user already exists:', adminExists.email);
    }
    
    console.log('✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    // Close Prisma connection
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });