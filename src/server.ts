import express from 'express';
import payload from 'payload';
import path from 'path';
import listsRouter from './endpoints/listEndpoints';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Payload API
// Initialize Payload
async function start() {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || '' // Ensure PAYLOAD_SECRET is in .env
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Add your own express routes here
  // Route for list management API
  app.use('/api/lists', listsRouter);

  // Static serving for JSON files from the 'data' directory
  // The user asked for /lists/*.json, this makes them available at /data-files/*.json
  // To avoid conflict with /api/lists if that was the chosen path for static files.
  // If the frontend needs to fetch them directly, this route can be used.
  // Example: /data-files/category.json
  app.use('/data-files', express.static(path.join(__dirname, '../data')));

  app.listen(PORT, () => {
    payload.logger.info(`Server listening on port ${PORT}`);
  });
}

start(); 