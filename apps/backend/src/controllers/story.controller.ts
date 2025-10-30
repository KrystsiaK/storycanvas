import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { OpenAIService } from '../services/openai.service';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';
import { cacheService } from '../lib/redis';

const openaiService = new OpenAIService();

export class StoryController {
  private cacheKeyPrefix = 'story';
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
      logger.error('Generate story error:', error);
      res.status(500).json({ error: 'Failed to generate story' });
    }
  }

  async getStories(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      
      // Pagination parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Cache key with pagination
      const cacheKey = `${this.cacheKeyPrefix}:user:${userId}:list:page:${page}:limit:${limit}`;

      // Try cache first
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        logger.debug(`Cache hit for stories list: ${cacheKey}`);
        return res.json(cached);
      }

      // Get total count for pagination
      const total = await prisma.story.count({ where: { userId } });

      // Fetch stories with pagination
      const stories = await prisma.story.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          characters: {
            include: {
              character: true,
            },
          },
        },
      });

      const response = {
        stories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + stories.length < total,
        },
      };

      // Cache for 3 minutes
      await cacheService.set(cacheKey, response, cacheService.getTTL().short * 3);

      res.json(response);
    } catch (error) {
      logger.error('Get stories error:', error);
      res.status(500).json({ error: 'Failed to fetch stories' });
    }
  }

  async getStory(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const cacheKey = `${this.cacheKeyPrefix}:${id}`;

      // Try cache first
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        logger.debug(`Cache hit for story: ${cacheKey}`);
        return res.json(cached);
      }

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

      // Cache for 10 minutes
      await cacheService.set(cacheKey, story, cacheService.getTTL().medium * 2);

      res.json(story);
    } catch (error) {
      logger.error('Get story error:', error);
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

      // Invalidate cache
      await cacheService.del(`${this.cacheKeyPrefix}:${id}`);
      await cacheService.delPattern(`${this.cacheKeyPrefix}:user:${userId}:list:*`);

      res.json(story);
    } catch (error) {
      logger.error('Update story error:', error);
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

      // Invalidate cache
      await cacheService.del(`${this.cacheKeyPrefix}:${id}`);
      await cacheService.delPattern(`${this.cacheKeyPrefix}:user:${userId}:list:*`);

      res.json({ message: 'Story deleted successfully' });
    } catch (error) {
      logger.error('Delete story error:', error);
      res.status(500).json({ error: 'Failed to delete story' });
    }
  }
}

