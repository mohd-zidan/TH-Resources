// Script to test Payload CMS initialization
import dotenv from 'dotenv';
import { payload } from 'payload';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testPayloadInitialization() {
  console.log('Testing Payload CMS initialization...');
  
  // Check required environment variables
  if (!process.env.PAYLOAD_SECRET) {
    console.error('❌ PAYLOAD_SECRET environment variable is not set');
    process.exit(1);
  }
  
  if (!process.env.DATABASE_URI) {
    console.error('❌ DATABASE_URI environment variable is not set');
    process.exit(1);
  }
  
  try {
    console.log('Attempting to initialize Payload CMS...');
    
    // Initialize Payload
    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: true,
      onInit: async (cms) => {
        // Successfully initialized
        console.log('✅ Payload CMS initialized successfully!');
        
        // Get collections
        const collections = cms.collections;
        console.log(`\n✅ Available collections: ${Object.keys(collections).join(', ')}`);
        
        // Try to count documents in each collection
        console.log('\nChecking collection data:');
        for (const collectionName of Object.keys(collections)) {
          try {
            const count = await cms.find({
              collection: collectionName,
              limit: 0,
            }).then(res => res.totalDocs);
            
            console.log(`✅ Collection '${collectionName}' has ${count} documents`);
          } catch (err) {
            console.error(`❌ Error accessing collection '${collectionName}':`, err.message);
          }
        }
        
        // Check if admin user exists
        try {
          const usersCollection = collections.users;
          if (usersCollection) {
            const adminCount = await cms.find({
              collection: 'users',
              where: {
                role: { equals: 'admin' },
              },
              limit: 0,
            }).then(res => res.totalDocs);
            
            if (adminCount > 0) {
              console.log(`✅ Found ${adminCount} admin user(s)`);
            } else {
              console.log('⚠️ No admin users found. You may need to create an admin user.');
            }
          }
        } catch (err) {
          console.error('❌ Error checking admin users:', err.message);
        }
      },
    });
  } catch (error) {
    console.error('❌ Payload CMS initialization failed:');
    console.error(error.message);
    
    if (error.message.includes('database')) {
      console.error('\nThis appears to be a database connection issue. Try running the database test script:');
      console.error('pnpm run test:db');
    }
    
    if (error.message.includes('secret')) {
      console.error('\nThis appears to be an issue with the PAYLOAD_SECRET. Make sure it is set correctly.');
    }
    
    process.exit(1);
  }
}

// Run the test
testPayloadInitialization();