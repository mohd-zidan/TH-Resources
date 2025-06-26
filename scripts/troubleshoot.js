// Comprehensive troubleshooting script for Vercel deployment issues
import { execSync } from 'child_process';
import readline from 'readline';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Main troubleshooting function
async function troubleshoot() {
  console.log('\n🔍 VERCEL DEPLOYMENT TROUBLESHOOTING GUIDE 🔍');
  console.log('===========================================');
  console.log('This script will help diagnose issues with your Vercel deployment.');
  console.log('Follow the prompts to run various tests and checks.');
  
  // Step 1: Check environment variables
  await askToRunTest(
    'Step 1: Check environment variables',
    'This test will verify that all required environment variables are set correctly.',
    'test:env'
  );
  
  // Step 2: Test database connection
  await askToRunTest(
    'Step 2: Test database connection',
    'This test will verify that your database is accessible and properly configured.',
    'test:db'
  );
  
  // Step 3: Test Payload CMS initialization
  await askToRunTest(
    'Step 3: Test Payload CMS initialization',
    'This test will verify that Payload CMS can initialize correctly.',
    'test:payload'
  );
  
  // Step 4: Test Next.js API routes
  await askToRunTest(
    'Step 4: Test Next.js API routes',
    'This test will verify that Next.js API routes are responding correctly.',
    'test:api'
  );
  
  // Step 5: Check for common issues
  console.log('\n\nStep 5: Common issues checklist');
  console.log('----------------------------');
  
  const commonIssues = [
    {
      name: 'Environment variable mismatch',
      check: 'Ensure DATABASE_URI (not DATABASE_URL) is set in Vercel dashboard',
      solution: 'Update environment variable names in Vercel dashboard to match exactly what the code expects'
    },
    {
      name: 'Database migration not run',
      check: 'Check if database tables exist',
      solution: 'Run "pnpm run migrate" after deployment'
    },
    {
      name: 'Node.js version incompatibility',
      check: 'Vercel should use Node.js 20.x',
      solution: 'Set Node.js version to 20.x in Vercel dashboard (Settings > General > Node.js Version)'
    },
    {
      name: 'Database connection issues',
      check: 'Database should allow connections from Vercel IP addresses',
      solution: 'Check database firewall settings or use a database service that integrates with Vercel'
    },
    {
      name: 'Memory limits exceeded',
      check: 'Check if operations are exceeding Vercel function memory limits',
      solution: 'Optimize code or upgrade to a plan with higher memory limits'
    }
  ];
  
  for (const issue of commonIssues) {
    console.log(`\n• ${issue.name}`);
    console.log(`  Check: ${issue.check}`);
    console.log(`  Solution: ${issue.solution}`);
  }
  
  // Step 6: Viewing Vercel logs
  console.log('\n\nStep 6: Viewing Vercel logs');
  console.log('------------------------');
  console.log('To view detailed error logs in Vercel:');
  console.log('1. Go to your Vercel dashboard and select your project');
  console.log('2. Navigate to the "Deployments" tab');
  console.log('3. Click on the most recent deployment');
  console.log('4. Select the "Functions" tab');
  console.log('5. Look for any functions with errors (marked in red)');
  console.log('6. Click on the function to view detailed logs');
  
  // Final summary
  console.log('\n\n🏁 Troubleshooting Complete 🏁');
  console.log('=========================');
  console.log('If you\'re still experiencing issues, consider:');
  console.log('1. Checking the Vercel function logs for specific error messages');
  console.log('2. Reviewing the Payload CMS documentation: https://payloadcms.com/docs');
  console.log('3. Asking for help in the Payload CMS Discord: https://discord.com/invite/payload');
  console.log('4. Opening a GitHub discussion: https://github.com/payloadcms/payload/discussions');
  
  // Close readline interface
  rl.close();
}

// Helper function to ask user if they want to run a test
async function askToRunTest(title, description, scriptName) {
  console.log(`\n\n${title}`);
  console.log('-'.repeat(title.length));
  console.log(description);
  
  return new Promise((resolve) => {
    rl.question('\nRun this test? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        try {
          console.log(`\nRunning ${scriptName}...\n`);
          execSync(`pnpm run ${scriptName}`, { stdio: 'inherit' });
        } catch (error) {
          console.error(`Error running ${scriptName}:`, error.message);
        }
      } else {
        console.log('Skipping this test.');
      }
      resolve();
    });
  });
}

// Run the troubleshooting guide
troubleshoot();