import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'src/shared/types/index';
import logger from 'src/utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error('Error occurred:', err);

  // Determine if the error is a known HttpError
  const isHttpError = err instanceof HttpError;
  const statusCode = isHttpError ? err.statusCode : 500;
  const message = isHttpError ? err.message : 'Internal Server Error';

  // Prepare the error response object
  const errorResponse: any = {
    status: statusCode,
    message: message,
  };

  // Include error details and stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = err.message;
    errorResponse.stack = err.stack;
  }

  // Send the error response to the client
  if (!res.headersSent) {
    res.status(statusCode).json(errorResponse);
  } else {
    next(err);
  }
};