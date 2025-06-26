// Script to check environment variables
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

function checkEnvironmentVariables() {
  console.log('Checking environment variables...');
  
  // Define required environment variables
  const requiredVars = [
    'PAYLOAD_SECRET',
    'DATABASE_URI',
    'PAYLOAD_PUBLIC_SERVER_URL'
  ];
  
  // Define optional but recommended environment variables
  const optionalVars = [
    'NODE_ENV',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM_ADDRESS',
    'SMTP_FROM_NAME'
  ];
  
  let missingRequired = false;
  
  // Check required variables
  console.log('\nRequired environment variables:');
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      const value = varName.includes('SECRET') || varName.includes('PASS') || varName.includes('DATABASE') 
        ? '****' // Mask sensitive values
        : process.env[varName];
      console.log(`✅ ${varName}: ${value}`);
    } else {
      console.log(`❌ ${varName}: MISSING`);
      missingRequired = true;
    }
  }
  
  // Check optional variables
  console.log('\nOptional environment variables:');
  for (const varName of optionalVars) {
    if (process.env[varName]) {
      const value = varName.includes('SECRET') || varName.includes('PASS') 
        ? '****' // Mask sensitive values
        : process.env[varName];
      console.log(`✅ ${varName}: ${value}`);
    } else {
      console.log(`⚠️ ${varName}: Not set`);
    }
  }
  
  // Check for common environment variable name mismatches
  const commonMismatches = [
    { correct: 'DATABASE_URI', incorrect: 'DATABASE_URL' },
    { correct: 'PAYLOAD_PUBLIC_SERVER_URL', incorrect: 'SERVER_URL' },
    { correct: 'PAYLOAD_SECRET', incorrect: 'SECRET_KEY' }
  ];
  
  console.log('\nChecking for common environment variable name mismatches:');
  let hasMismatch = false;
  
  for (const { correct, incorrect } of commonMismatches) {
    if (!process.env[correct] && process.env[incorrect]) {
      console.log(`⚠️ Found "${incorrect}" but the application expects "${correct}". This may cause issues.`);
      hasMismatch = true;
    }
  }
  
  if (!hasMismatch) {
    console.log('✅ No common environment variable name mismatches found.');
  }
  
  // Final summary
  console.log('\nEnvironment check summary:');
  if (missingRequired) {
    console.log('❌ Some required environment variables are missing. The application will likely fail to start.');
  } else {
    console.log('✅ All required environment variables are set.');
  }
  
  // Check DATABASE_URI format
  if (process.env.DATABASE_URI) {
    try {
      const url = new URL(process.env.DATABASE_URI);
      if (url.protocol !== 'postgresql:') {
        console.log(`⚠️ DATABASE_URI protocol is "${url.protocol}//", but "postgresql://" is expected.`);
      } else {
        console.log('✅ DATABASE_URI format appears to be valid.');
      }
    } catch (error) {
      console.log('❌ DATABASE_URI is not a valid URL format. It should be: postgresql://username:password@hostname:port/database');
    }
  }
  
  // Check PAYLOAD_PUBLIC_SERVER_URL format
  if (process.env.PAYLOAD_PUBLIC_SERVER_URL) {
    try {
      const url = new URL(process.env.PAYLOAD_PUBLIC_SERVER_URL);
      if (!url.protocol.startsWith('http')) {
        console.log(`⚠️ PAYLOAD_PUBLIC_SERVER_URL protocol is "${url.protocol}//", but "http://" or "https://" is expected.`);
      } else {
        console.log('✅ PAYLOAD_PUBLIC_SERVER_URL format appears to be valid.');
      }
    } catch (error) {
      console.log('❌ PAYLOAD_PUBLIC_SERVER_URL is not a valid URL format. It should be: https://your-domain.com');
    }
  }
}

// Run the check
checkEnvironmentVariables();