import mongoose from 'mongoose';
import { MONGODB_URI } from 'src/backend/config/server';

const MONGOOSE_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

export const connectDatabase = async (): Promise<void> => {
  try {
    // Set Mongoose to use native Promises
    mongoose.Promise = global.Promise;

    // Attempt to connect to the database using MONGODB_URI
    await mongoose.connect(MONGODB_URI, MONGOOSE_OPTIONS);

    console.log('Successfully connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    // Attempt to close the Mongoose connection
    await mongoose.disconnect();

    console.log('Successfully disconnected from the database');
  } catch (error) {
    console.error('Error disconnecting from the database:', error);
    throw error;
  }
};

// Human tasks:
// TODO: Implement connection pooling for better performance
// TODO: Add retry logic for database connection attempts
// TODO: Implement a health check function to verify database connectivity
// TODO: Add support for read replicas if needed for scalability
// TODO: Implement database migration scripts for schema changes
// TODO: Add support for database transactions
// TODO: Implement database connection monitoring and logging