import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from 'src/backend/models/User';
import { UserDocument } from 'src/shared/types/index';
import { JWT_SECRET, JWT_EXPIRATION } from 'src/backend/config/server';

export class AuthService {
  constructor() {}

  async register(userData: object): Promise<UserDocument> {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create a new User document with the provided userData
    const newUser = new User(userData);

    // Save the new user document
    await newUser.save();

    // Return the newly created user document
    return newUser;
  }

  async login(email: string, password: string): Promise<{ user: UserDocument, token: string }> {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate a JWT token with user information
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // Return the user document and the generated token
    return { user, token };
  }

  async verifyToken(token: string): Promise<UserDocument> {
    try {
      // Verify the JWT token using the JWT_SECRET
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

      // Extract the user ID from the decoded token
      const userId = decoded.userId;

      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Return the user document
      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async changePassword(user: UserDocument, currentPassword: string, newPassword: string): Promise<UserDocument> {
    // Compare the provided current password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password with the new hashed password
    user.password = hashedPassword;

    // Save the updated user document
    await user.save();

    // Return the updated user document
    return user;
  }
}