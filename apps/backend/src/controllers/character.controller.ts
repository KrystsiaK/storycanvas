import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { OpenAIService } from '../services/openai.service';

const prisma = new PrismaClient();
const openaiService = new OpenAIService();

export class CharacterController {
  async generateCharacter(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { name, description } = req.body;

      if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
      }

      // Generate character image using DALL-E
      let imageUrl: string | undefined;
      try {
        imageUrl = await openaiService.generateCharacterImage(description);
      } catch (error) {
        console.error('Failed to generate character image:', error);
        // Continue without image
      }

      // Save character to database
      const character = await prisma.character.create({
        data: {
          name,
          description,
          imageUrl,
          userId,
        },
      });

      res.status(201).json(character);
    } catch (error) {
      console.error('Generate character error:', error);
      res.status(500).json({ error: 'Failed to generate character' });
    }
  }

  async getCharacters(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      const characters = await prisma.character.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      res.json(characters);
    } catch (error) {
      console.error('Get characters error:', error);
      res.status(500).json({ error: 'Failed to fetch characters' });
    }
  }

  async getCharacter(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const character = await prisma.character.findFirst({
        where: { id, userId },
      });

      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }

      res.json(character);
    } catch (error) {
      console.error('Get character error:', error);
      res.status(500).json({ error: 'Failed to fetch character' });
    }
  }

  async deleteCharacter(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      // Verify ownership
      const existingCharacter = await prisma.character.findFirst({
        where: { id, userId },
      });

      if (!existingCharacter) {
        return res.status(404).json({ error: 'Character not found' });
      }

      // Delete character
      await prisma.character.delete({ where: { id } });

      res.json({ message: 'Character deleted successfully' });
    } catch (error) {
      console.error('Delete character error:', error);
      res.status(500).json({ error: 'Failed to delete character' });
    }
  }
}

