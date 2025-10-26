import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { OpenAIService } from '../services/openai.service';

const prisma = new PrismaClient();
const openaiService = new OpenAIService();

export class StoryController {
  async generateStory(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { character, genre, language, ageGroup, theme, moralLesson } = req.body;

      // Validate input
      if (!character || !character.name || !character.description || !genre || !language || !ageGroup) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Generate story using OpenAI
      const { title, content } = await openaiService.generateStory({
        character,
        genre,
        language,
        ageGroup,
        theme,
        moralLesson,
      });

      // Save story to database
      const story = await prisma.story.create({
        data: {
          title,
          content,
          genre,
          language,
          ageGroup,
          theme,
          moralLesson,
          userId,
        },
      });

      res.status(201).json(story);
    } catch (error) {
      console.error('Generate story error:', error);
      res.status(500).json({ error: 'Failed to generate story' });
    }
  }

  async getStories(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      const stories = await prisma.story.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          characters: {
            include: {
              character: true,
            },
          },
        },
      });

      res.json(stories);
    } catch (error) {
      console.error('Get stories error:', error);
      res.status(500).json({ error: 'Failed to fetch stories' });
    }
  }

  async getStory(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const story = await prisma.story.findFirst({
        where: { id, userId },
        include: {
          characters: {
            include: {
              character: true,
            },
          },
        },
      });

      if (!story) {
        return res.status(404).json({ error: 'Story not found' });
      }

      res.json(story);
    } catch (error) {
      console.error('Get story error:', error);
      res.status(500).json({ error: 'Failed to fetch story' });
    }
  }

  async updateStory(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const updates = req.body;

      // Verify ownership
      const existingStory = await prisma.story.findFirst({
        where: { id, userId },
      });

      if (!existingStory) {
        return res.status(404).json({ error: 'Story not found' });
      }

      // Update story
      const story = await prisma.story.update({
        where: { id },
        data: updates,
      });

      res.json(story);
    } catch (error) {
      console.error('Update story error:', error);
      res.status(500).json({ error: 'Failed to update story' });
    }
  }

  async deleteStory(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      // Verify ownership
      const existingStory = await prisma.story.findFirst({
        where: { id, userId },
      });

      if (!existingStory) {
        return res.status(404).json({ error: 'Story not found' });
      }

      // Delete story
      await prisma.story.delete({ where: { id } });

      res.json({ message: 'Story deleted successfully' });
    } catch (error) {
      console.error('Delete story error:', error);
      res.status(500).json({ error: 'Failed to delete story' });
    }
  }
}

