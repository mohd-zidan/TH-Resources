import express, { Request, Response, NextFunction } from 'express';
import payload from 'payload';
import path from 'path';
import { fileURLToPath } from 'url';
import listsRouter from './endpoints/listEndpoints.js'; // Add .js extension for ES modules
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// JSON error handler for invalid JSON
const jsonErrorHandler = (error: any, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof SyntaxError && (error as any).status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next();
};

// Initialize Payload
async function start() {
  try {
    // Validate required environment variables
    if (!process.env.PAYLOAD_SECRET) {
      throw new Error('PAYLOAD_SECRET is required in environment variables');
    }

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required in environment variables');
    }

    // Initialize Payload (PostgreSQL configuration)

    // Add your custom express routes here (after Payload initialization)
    // Route for list management API
    app.use('/api/lists', listsRouter);

    // Static serving for JSON files from the 'data' directory
    const dataPath = path.join(__dirname, '../data');
    app.use(
      '/data-files',
      express.static(dataPath, {
        fallthrough: false, // Prevents falling through to next middleware on error
        setHeaders: (res: Response, filePath: string) => {
          if (filePath.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/json');
          }
        },
      }),
    );

    // 404 handler for unmatched routes
    app.use('*', (_req: Request, res: Response) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Global error handler (must be last)
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Global error handler:', err);
      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
      });
    });

    // Start the server
    app.listen(PORT, () => {
      payload.logger.info(`Server listening on port ${PORT}`);
      payload.logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

start();