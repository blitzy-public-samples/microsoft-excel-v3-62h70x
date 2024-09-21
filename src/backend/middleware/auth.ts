import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/backend/services/AuthService';
import { UserDocument } from 'src/shared/types/index';

interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract the JWT token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token using AuthService.verifyToken
    const authService = new AuthService(); // Assuming AuthService is instantiable
    const user = await authService.verifyToken(token);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Add the authenticated user to the request object
    req.user = user;

    // Call next() to pass control to the next middleware
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};