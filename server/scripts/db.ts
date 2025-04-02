import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const mongoUrl = process.env.DATABASE_URL || '';

async function main() {
  // Connect directly to MongoDB since we're having issues with Prisma
  const mongoClient = new MongoClient(mongoUrl);
  
  try {
    console.log('🔄 Setting up the database...');
    
    // Connect to MongoDB
    await mongoClient.connect();
    console.log('✅ Connected to MongoDB');
    
    // Extract database name from connection string
    const dbName = mongoUrl.split('/').pop()?.split('?')[0];
    if (!dbName) {
      throw new Error('Could not determine database name from connection string');
    }
    
    const db = mongoClient.db(dbName);
    
    // First let's try to fix any inconsistent date fields in the database
    try {
      // Fix createdAt fields that might be stored as strings
      const usersCollection = db.collection('users');
      
      // Find users with string createdAt fields
      const usersToFix = await usersCollection.find({
        createdAt: { $type: 'string' }
      }).toArray();
      
      console.log(`Found ${usersToFix.length} users with string dates to fix`);
      
      // Update each user with a proper date object
      for (const user of usersToFix) {
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { 
              createdAt: new Date(user.createdAt),
              updatedAt: new Date(user.updatedAt || user.createdAt)
            } 
          }
        );
      }
      
      // Do the same for profiles collection
      const profilesCollection = db.collection('profiles');
      const profilesToFix = await profilesCollection.find({
        createdAt: { $type: 'string' }
      }).toArray();
      
      console.log(`Found ${profilesToFix.length} profiles with string dates to fix`);
      
      for (const profile of profilesToFix) {
        await profilesCollection.updateOne(
          { _id: profile._id },
          { $set: { 
              createdAt: new Date(profile.createdAt),
              updatedAt: new Date(profile.updatedAt || profile.createdAt)
            } 
          }
        );
      }
      
      console.log('✅ Fixed date fields in the database');
    } catch (error) {
      console.warn('⚠️ Error fixing dates:', error);
      // Continue with the script even if date fixing fails
    }
    
    // Check if admin user exists
    try {
      const user = await db.collection('users').findOne({ email: 'admin@example.com' });
      
      if (!user) {
        // Create admin user directly with MongoDB driver
        const userId = new ObjectId();
        
        await db.collection('users').insertOne({
          _id: userId,
          email: 'admin@example.com',
          name: 'Admin User',
          password: 'adminPassword123', // In production, use hashed passwords
          role: 'ADMIN',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        // Create profile for the user
        await db.collection('profiles').insertOne({
          _id: new ObjectId(),
          bio: 'System administrator',
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log('👤 Created admin user: admin@example.com');
      } else {
        console.log('👤 Admin user already exists:', user.email);
      }
      
      console.log('✅ Database setup complete!');
    } catch (error) {
      console.error('❌ Error during user creation:', error);
    }
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    // Close connections
    await mongoClient.close();
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });