import { Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';
import { AuthRequest } from '../middleware/auth.middleware';

export class ProfileController {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      const { name, email, avatar, currentPassword, newPassword } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If email is being changed, check if new email is already taken
      if (email && email !== existingUser.email) {
        const emailTaken = await prisma.user.findUnique({ where: { email } });
        if (emailTaken) {
          return res.status(400).json({ error: 'Email already in use' });
        }
      }

      // Prepare update data
      const updateData: any = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (avatar !== undefined) updateData.avatar = avatar;

      // Handle password change
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ error: 'Current password is required to change password' });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        updateData.password = await bcrypt.hash(newPassword, 10);
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({ user: updatedUser });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  async deleteAccount(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      const { password } = req.body;

      // Get user with password
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Password is incorrect' });
      }

      // Delete user (cascade will delete stories and characters)
      await prisma.user.delete({ where: { id: userId } });

      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      logger.error('Delete account error:', error);
      res.status(500).json({ error: 'Failed to delete account' });
    }
  }
}

