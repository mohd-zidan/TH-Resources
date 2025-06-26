# Payload Blank Template

This template comes configured with the bare minimum to get started on anything you need.

## Quick start

This template can be deployed directly from our Cloud hosting and it will setup MongoDB and cloud S3 object storage for media.

## Quick Start - local setup

To spin up this template locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

### Development

1. First [clone the repo](#clone) if you have not done so already
2. `cd my-project && cp .env.example .env` to copy the example environment variables. You'll need to add the `MONGODB_URI` from your Cloud project to your `.env` if you want to use S3 storage and the MongoDB database that was created for you.

3. `pnpm install && pnpm dev` to install dependencies and start the dev server
4. open `http://localhost:3000` to open the app in your browser

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create your first admin user. Then check out [Production](#production) once you're ready to build and serve your app, and [Deployment](#deployment) when you're ready to go live.

#### Docker (Optional)

If you prefer to use Docker for local development instead of a local MongoDB instance, the provided docker-compose.yml file can be used.

To do so, follow these steps:

- Modify the `MONGODB_URI` in your `.env` file to `mongodb://127.0.0.1/<dbname>`
- Modify the `docker-compose.yml` file's `MONGODB_URI` to match the above `<dbname>`
- Run `docker-compose up` to start the database, optionally pass `-d` to run in the background.

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## Deployment

### Deploying to Vercel

This project is configured to be deployed on Vercel using pnpm. Follow these steps to deploy:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Create a new project on [Vercel](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect the Next.js framework
5. Set up a PostgreSQL database:
   - You can use services like [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres), [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or [Railway](https://railway.app/)
   - Create a new PostgreSQL database instance
   - Get the connection string in the format: `postgresql://username:password@hostname:port/database`
6. Set the Node.js version in the Vercel dashboard (Settings > General > Node.js Version):
   - Set it to 20.x (LTS) as specified in the package.json engines field

7. Configure the following environment variables in the Vercel dashboard (Settings > Environment Variables):
   - `PAYLOAD_SECRET`: A secure random string for encrypting sessions and JWT tokens
   - `DATABASE_URI`: Your PostgreSQL connection string from step 5
   - `PAYLOAD_PUBLIC_SERVER_URL`: The URL of your deployed application (e.g., `https://your-app.vercel.app`)
   
   Note: For security, it's better to set these values directly in the Vercel dashboard rather than using the `@` references in vercel.json
8. Run database migrations:
   - After the first deployment, you'll need to run migrations to set up your database schema
   - You can do this by running a one-time command in the Vercel dashboard:
     ```
     pnpm run migrate
     ```
9. Deploy your application

The included `vercel.json` file configures the build settings for pnpm, so no additional configuration is needed for the package manager.

### Troubleshooting Vercel Deployment

1. **Database Connection Issues**:
   - Ensure your PostgreSQL database allows connections from Vercel's IP addresses
   - Check that your connection string is correctly formatted
   - Verify that the database user has the necessary permissions

2. **Build Failures**:
   - Check the build logs in Vercel for specific errors
   - Ensure all dependencies are properly installed
   - Make sure your Node.js version is compatible (this project requires Node.js 18.20.2 or 20.9.0+)

3. **Runtime Errors**:
   - Check that all required environment variables are set
   - Verify that your database migrations have been applied
   - Use Vercel's function logs to debug runtime issues

### Debugging 500 Internal Server Errors

If you encounter a 500 Internal Server Error after deploying to Vercel, this project includes a comprehensive troubleshooting guide and several diagnostic tools to help you identify and fix the issue.

#### Interactive Troubleshooting Guide

Run the interactive troubleshooting guide to walk through all diagnostic steps:

```bash
# First, set your Vercel environment variables locally
# You can copy them from the Vercel dashboard
export PAYLOAD_SECRET="your_payload_secret"
export DATABASE_URI="your_database_uri"
export PAYLOAD_PUBLIC_SERVER_URL="your_server_url"

# Then run the troubleshooting guide
pnpm run troubleshoot
```

This guide will walk you through:
- Environment variable checks
- Database connection tests
- Payload CMS initialization tests
- Next.js API route tests
- Common issues checklist
- Instructions for viewing Vercel logs

#### Individual Diagnostic Tools

You can also run individual diagnostic tools:

1. **Check Environment Variables**:
   ```bash
   pnpm run test:env
   ```

2. **Test Database Connection**:
   ```bash
   pnpm run test:db
   ```

3. **Test Payload CMS Initialization**:
   ```bash
   pnpm run test:payload
   ```

4. **Test Next.js API Routes**:
   ```bash
   pnpm run test:api
   ```

#### Viewing Vercel Logs

To view the actual error details in Vercel:

1. Go to your Vercel dashboard and select your project
2. Navigate to the "Deployments" tab
3. Click on the most recent deployment
4. Select the "Functions" tab
5. Look for any functions with errors (marked in red)
6. Click on the function to view detailed logs

#### Common Causes of 500 Errors

1. **Database Connection Issues**:
   - Check that your `DATABASE_URI` is correct and the database is accessible from Vercel
   - Ensure your database allows connections from Vercel's IP addresses

2. **Environment Variable Problems**:
   - Ensure all required variables (`PAYLOAD_SECRET`, `DATABASE_URI`, `PAYLOAD_PUBLIC_SERVER_URL`) are set
   - Verify that environment variable names match exactly what the code expects (e.g., `DATABASE_URI` not `DATABASE_URL`)

3. **Database Migration Issues**:
   - Make sure you've run `pnpm run migrate` after the initial deployment
   - Check if database tables exist using the database test script

4. **Node.js Version Compatibility**:
   - Ensure you're using Node.js 20.x (LTS) as specified in the package.json engines field
   - Set this in the Vercel dashboard under Settings > General > Node.js Version

5. **Memory or Performance Limits**:
   - Vercel functions have memory limits - check if your operations are exceeding these limits
   - Consider optimizing database queries or reducing payload sizes

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
