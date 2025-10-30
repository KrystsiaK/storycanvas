import { Response } from 'express';
import { ProfileController } from '../../../controllers/profile.controller';
import { prisma } from '../../../lib/prisma';
import { AuthRequest } from '../../../middleware/auth.middleware';
import bcrypt from 'bcrypt';

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));
jest.mock('bcrypt');

describe('ProfileController', () => {
  let profileController: ProfileController;
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    profileController = new ProfileController();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    mockRequest = {
      userId: 'user-123',
      body: {},
    } as Partial<AuthRequest>;
    
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await profileController.getProfile(mockRequest as AuthRequest, mockResponse as Response);

      expect(jsonMock).toHaveBeenCalledWith({ user: mockUser });
    });

    it('should return 404 if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await profileController.getProfile(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 500 on error', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await profileController.getProfile(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to fetch profile' });
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const existingUser = {
        id: 'user-123',
        email: 'john@example.com',
        password: 'hashed-password',
      };

      const updatedUser = {
        id: 'user-123',
        name: 'John Updated',
        email: 'john@example.com',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = { name: 'John Updated' };

      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingUser) // First call: check if user exists
        .mockResolvedValue(null); // Second call: check if email is taken (not applicable here)

      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      await profileController.updateProfile(mockRequest as AuthRequest, mockResponse as Response);

      expect(jsonMock).toHaveBeenCalledWith({ user: updatedUser });
    });

    it('should return 400 if email already in use', async () => {
      const existingUser = {
        id: 'user-123',
        email: 'john@example.com',
        password: 'hashed-password',
      };

      mockRequest.body = { email: 'taken@example.com' };

      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingUser) // First call: check if user exists
        .mockResolvedValueOnce({ id: 'other-user' }); // Second call: email is taken

      await profileController.updateProfile(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Email already in use' });
    });

    it('should update password if current password is valid', async () => {
      const existingUser = {
        id: 'user-123',
        email: 'john@example.com',
        password: 'hashed-password',
      };

      mockRequest.body = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-password');
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...existingUser,
        password: 'new-hashed-password',
      });

      await profileController.updateProfile(mockRequest as AuthRequest, mockResponse as Response);

      expect(bcrypt.compare).toHaveBeenCalledWith('oldpassword', 'hashed-password');
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(jsonMock).toHaveBeenCalled();
    });

    it('should return 401 if current password is incorrect', async () => {
      const existingUser = {
        id: 'user-123',
        email: 'john@example.com',
        password: 'hashed-password',
      };

      mockRequest.body = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await profileController.updateProfile(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Current password is incorrect' });
    });

    it('should return 400 if new password provided without current password', async () => {
      const existingUser = {
        id: 'user-123',
        email: 'john@example.com',
        password: 'hashed-password',
      };

      mockRequest.body = {
        newPassword: 'newpassword123',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

      await profileController.updateProfile(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Current password is required to change password' });
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      const mockUser = {
        id: 'user-123',
        password: 'hashed-password',
      };

      mockRequest.body = { password: 'correctpassword' };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (prisma.user.delete as jest.Mock).mockResolvedValue(mockUser);

      await profileController.deleteAccount(mockRequest as AuthRequest, mockResponse as Response);

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'user-123' } });
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Account deleted successfully' });
    });

    it('should return 401 if password is incorrect', async () => {
      const mockUser = {
        id: 'user-123',
        password: 'hashed-password',
      };

      mockRequest.body = { password: 'wrongpassword' };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await profileController.deleteAccount(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Password is incorrect' });
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      mockRequest.body = { password: 'anypassword' };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await profileController.deleteAccount(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });
});

