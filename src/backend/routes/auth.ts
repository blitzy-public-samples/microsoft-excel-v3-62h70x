import { Router } from 'express';
import { AuthController } from 'src/backend/controllers/AuthController';
import { validateRegistration, validateLogin, validatePasswordChange } from 'src/backend/middleware/validation';
import { authMiddleware } from 'src/backend/middleware/auth';

const createAuthRouter = (authController: AuthController): Router => {
  const router = Router();

  // POST /register - User registration
  router.post('/register', validateRegistration, authController.register);

  // POST /login - User login
  router.post('/login', validateLogin, authController.login);

  // POST /logout - User logout
  router.post('/logout', authController.logout);

  // POST /change-password - Change user password
  router.post('/change-password', authMiddleware, validatePasswordChange, authController.changePassword);

  return router;
};

export default createAuthRouter;

// TODO: Implement rate limiting middleware for authentication routes to prevent brute force attacks
// TODO: Add support for OAuth authentication routes (e.g., Google, Microsoft)
// TODO: Implement email verification route for new user registrations
// TODO: Add password reset functionality and associated routes
// TODO: Implement two-factor authentication routes
// TODO: Add logging middleware for authentication events
// TODO: Implement CSRF protection for authentication routes