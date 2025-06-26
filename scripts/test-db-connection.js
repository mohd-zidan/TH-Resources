// Script to test database connection
import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testDatabaseConnection() {
  // Get the database connection string from environment variables
  const connectionString = process.env.DATABASE_URI;
  
  if (!connectionString) {
    console.error('ERROR: DATABASE_URI environment variable is not set');
    process.exit(1);
  }

  console.log('Testing database connection...');
  console.log(`Connection string format: ${maskConnectionString(connectionString)}`);
  
  const client = new Client({
    connectionString,
  });

  try {
    // Attempt to connect to the database
    await client.connect();
    console.log('✅ Successfully connected to the database!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log(`✅ Database query successful. Current time: ${result.rows[0].current_time}`);
    
    // Get database version
    const versionResult = await client.query('SELECT version()');
    console.log(`✅ Database version: ${versionResult.rows[0].version}`);
    
    // Check for existing tables
    const tablesResult = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    
    if (tablesResult.rows.length > 0) {
      console.log('✅ Found existing tables:');
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('⚠️ No tables found in the database. You may need to run migrations.');
    }
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    
    // Provide more specific error messages based on common issues
    if (error.code === 'ENOTFOUND') {
      console.error('\nThe database host could not be found. Check your DATABASE_URI for typos in the hostname.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\nConnection refused. Possible causes:');
      console.error('- Database server is not running');
      console.error('- Firewall is blocking the connection');
      console.error('- Wrong port number in the connection string');
    } else if (error.code === '28P01') {
      console.error('\nAuthentication failed. Check your username and password in the DATABASE_URI.');
    } else if (error.code === '3D000') {
      console.error('\nDatabase does not exist. You may need to create it first.');
    }
    
    process.exit(1);
  } finally {
    // Close the connection
    await client.end();
  }
}

// Function to mask sensitive parts of the connection string for logging
function maskConnectionString(connectionString) {
  try {
    // Create a URL object from the connection string
    // This will throw an error if the connection string is not a valid URL
    const url = new URL(connectionString);
    
    // Mask the password
    if (url.password) {
      url.password = '****';
    }
    
    // Return the masked connection string format
    return url.toString();
  } catch (error) {
    // If parsing fails, return a generic masked format
    return 'postgresql://username:****@hostname:port/database';
  }
}

// Run the test
testDatabaseConnection();