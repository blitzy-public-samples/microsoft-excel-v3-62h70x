import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/backend/services/AuthService';
import { UserDocument } from 'src/shared/types/index';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name } = req.body;

      // Input validation
      if (!email || !password || !name) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      // Call authService to register user
      const user = await this.authService.register({ email, password, name });

      // Return success response
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Input validation
      if (!email || !password) {
        res.status(400).json({ error: 'Missing email or password' });
        return;
      }

      // Call authService to login user
      const { user, token } = await this.authService.login(email, password);

      // Return success response
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      });
    } catch (error) {
      next(error);
    }
  }

  public async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = req.user as UserDocument; // Assuming auth middleware adds user to request

      // Input validation
      if (!currentPassword || !newPassword) {
        res.status(400).json({ error: 'Missing current password or new password' });
        return;
      }

      // Call authService to change password
      await this.authService.changePassword(user, currentPassword, newPassword);

      // Return success response
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a real implementation, you might want to invalidate the token on the server-side
      // For this example, we'll just send a success response
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      next(error);
    }
  }
}