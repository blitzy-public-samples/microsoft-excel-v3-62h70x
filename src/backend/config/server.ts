import dotenv from 'dotenv';

// Load environment variables from .env file
export function loadEnv(): void {
  dotenv.config();
  // If .env file is not found, it will use the system environment variables
}

// Server configuration constants
export const PORT: number = Number(process.env.PORT) || 3000;
export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/excel_app';
export const JWT_SECRET: string = process.env.JWT_SECRET as string;
export const JWT_EXPIRATION: string = process.env.JWT_EXPIRATION || '1d';
export const CORS_ORIGIN: string = process.env.CORS_ORIGIN || '*';
export const MAX_REQUEST_SIZE: string = process.env.MAX_REQUEST_SIZE || '50mb';

// Call loadEnv function to ensure environment variables are loaded
loadEnv();

// TODO: Review and update default values for production environment
// TODO: Implement secure storage for sensitive configuration (e.g., JWT_SECRET)
// TODO: Add configuration for rate limiting
// TODO: Implement configuration for logging levels
// TODO: Add configuration for database connection pooling
// TODO: Implement configuration for caching (e.g., Redis settings)
// TODO: Add configuration for external services (e.g., email service, cloud storage)