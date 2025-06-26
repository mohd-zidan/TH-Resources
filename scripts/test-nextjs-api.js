// Script to test Next.js API routes
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testNextJsApi() {
  console.log('Testing Next.js API routes...');
  
  // Get the server URL from environment variables
  const serverUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000';
  
  console.log(`Using server URL: ${serverUrl}`);
  console.log('\nTesting API endpoints:');
  
  // Define API endpoints to test
  const endpoints = [
    '/api/users',
    '/api/resources',
    '/api/globals/header',
    '/api/globals/footer',
  ];
  
  // Test each endpoint
  for (const endpoint of endpoints) {
    const url = `${serverUrl}${endpoint}`;
    try {
      console.log(`\nTesting endpoint: ${url}`);
      const response = await fetch(url);
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log('✅ Endpoint is accessible');
        
        // Try to parse the response as JSON
        try {
          const data = await response.json();
          console.log('Response data structure:', Object.keys(data).join(', '));
        } catch (err) {
          console.log('⚠️ Could not parse response as JSON');
        }
      } else {
        console.log('❌ Endpoint returned an error');
        
        // Try to parse the error response
        try {
          const errorData = await response.json();
          console.log('Error details:', JSON.stringify(errorData, null, 2));
        } catch (err) {
          console.log('Could not parse error response as JSON');
        }
      }
    } catch (error) {
      console.error(`❌ Failed to fetch ${url}:`);
      console.error(error.message);
      
      if (error.code === 'ECONNREFUSED') {
        console.error('Connection refused. Is the server running?');
      }
    }
  }
  
  console.log('\n✅ API testing complete');
}

// Run the test
testNextJsApi();