import { Response } from 'express';
import { StoryController } from '../../../controllers/story.controller';
import { prisma } from '../../../lib/prisma';
import { AuthRequest } from '../../../middleware/auth.middleware';

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    story: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('../../../services/openai.service', () => ({
  OpenAIService: jest.fn().mockImplementation(() => ({
    generateStory: jest.fn().mockResolvedValue({
      title: 'Test Story Title',
      content: 'This is a test story content.',
    }),
  })),
}));

describe('StoryController', () => {
  let storyController: StoryController;
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    storyController = new StoryController();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    mockRequest = {
      userId: 'test-user-id',
      body: {},
      params: {},
    };
    
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  describe('generateStory', () => {
    const validStoryData = {
      character: {
        name: 'Hero',
        description: 'A brave hero',
      },
      genre: 'Adventure',
      language: 'English',
      ageGroup: '6-8',
      theme: 'Courage',
      moralLesson: 'Be brave',
    };

    it('should generate story successfully', async () => {
      mockRequest.body = validStoryData;

      const mockStory = {
        id: '1',
        title: 'Test Story Title',
        content: 'This is a test story content.',
        genre: validStoryData.genre,
        language: validStoryData.language,
        ageGroup: validStoryData.ageGroup,
        theme: validStoryData.theme,
        moralLesson: validStoryData.moralLesson,
        userId: 'test-user-id',
        audioUrl: null,
        videoUrl: null,
        pdfUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.story.create as jest.Mock).mockResolvedValue(mockStory);

      await storyController.generateStory(mockRequest as AuthRequest, mockResponse as Response);

      expect(prisma.story.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Story Title',
          content: 'This is a test story content.',
          genre: validStoryData.genre,
          language: validStoryData.language,
          ageGroup: validStoryData.ageGroup,
          theme: validStoryData.theme,
          moralLesson: validStoryData.moralLesson,
          userId: 'test-user-id',
        },
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockStory);
    });

    it('should return 400 if required fields are missing', async () => {
      mockRequest.body = { genre: 'Adventure' };

      await storyController.generateStory(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });

    it('should return 500 on error', async () => {
      mockRequest.body = validStoryData;

      (prisma.story.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      await storyController.generateStory(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to generate story' });
    });
  });

  describe('getStories', () => {
    it('should get all stories for user', async () => {
      const mockStories = [
        {
          id: '1',
          title: 'Story 1',
          content: 'Content 1',
          genre: 'Adventure',
          language: 'English',
          ageGroup: '6-8',
          theme: null,
          moralLesson: null,
          audioUrl: null,
          videoUrl: null,
          pdfUrl: null,
          userId: 'test-user-id',
          createdAt: new Date(),
          updatedAt: new Date(),
          characters: [],
        },
      ];

      (prisma.story.findMany as jest.Mock).mockResolvedValue(mockStories);

      await storyController.getStories(mockRequest as AuthRequest, mockResponse as Response);

      expect(prisma.story.findMany).toHaveBeenCalledWith({
        where: { userId: 'test-user-id' },
        orderBy: { createdAt: 'desc' },
        include: {
          characters: {
            include: {
              character: true,
            },
          },
        },
      });
      expect(jsonMock).toHaveBeenCalledWith(mockStories);
    });

    it('should return 500 on error', async () => {
      (prisma.story.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await storyController.getStories(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to fetch stories' });
    });
  });

  describe('getStory', () => {
    it('should get a single story', async () => {
      mockRequest.params = { id: 'story-1' };

      const mockStory = {
        id: 'story-1',
        title: 'Test Story',
        content: 'Test Content',
        genre: 'Adventure',
        language: 'English',
        ageGroup: '6-8',
        userId: 'test-user-id',
        characters: [],
      };

      (prisma.story.findFirst as jest.Mock).mockResolvedValue(mockStory);

      await storyController.getStory(mockRequest as AuthRequest, mockResponse as Response);

      expect(prisma.story.findFirst).toHaveBeenCalledWith({
        where: { id: 'story-1', userId: 'test-user-id' },
        include: {
          characters: {
            include: {
              character: true,
            },
          },
        },
      });
      expect(jsonMock).toHaveBeenCalledWith(mockStory);
    });

    it('should return 404 if story not found', async () => {
      mockRequest.params = { id: 'non-existent' };

      (prisma.story.findFirst as jest.Mock).mockResolvedValue(null);

      await storyController.getStory(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Story not found' });
    });

    it('should return 500 on error', async () => {
      mockRequest.params = { id: 'story-1' };

      (prisma.story.findFirst as jest.Mock).mockRejectedValue(new Error('Database error'));

      await storyController.getStory(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to fetch story' });
    });
  });

  describe('updateStory', () => {
    it('should update story successfully', async () => {
      mockRequest.params = { id: 'story-1' };
      mockRequest.body = { title: 'Updated Title' };

      const existingStory = {
        id: 'story-1',
        userId: 'test-user-id',
      };

      const updatedStory = {
        ...existingStory,
        title: 'Updated Title',
      };

      (prisma.story.findFirst as jest.Mock).mockResolvedValue(existingStory);
      (prisma.story.update as jest.Mock).mockResolvedValue(updatedStory);

      await storyController.updateStory(mockRequest as AuthRequest, mockResponse as Response);

      expect(prisma.story.findFirst).toHaveBeenCalledWith({
        where: { id: 'story-1', userId: 'test-user-id' },
      });
      expect(prisma.story.update).toHaveBeenCalledWith({
        where: { id: 'story-1' },
        data: { title: 'Updated Title' },
      });
      expect(jsonMock).toHaveBeenCalledWith(updatedStory);
    });

    it('should return 404 if story not found', async () => {
      mockRequest.params = { id: 'non-existent' };
      mockRequest.body = { title: 'Updated Title' };

      (prisma.story.findFirst as jest.Mock).mockResolvedValue(null);

      await storyController.updateStory(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Story not found' });
    });

    it('should return 500 on error', async () => {
      mockRequest.params = { id: 'story-1' };
      mockRequest.body = { title: 'Updated Title' };

      (prisma.story.findFirst as jest.Mock).mockRejectedValue(new Error('Database error'));

      await storyController.updateStory(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to update story' });
    });
  });

  describe('deleteStory', () => {
    it('should delete story successfully', async () => {
      mockRequest.params = { id: 'story-1' };

      const existingStory = {
        id: 'story-1',
        userId: 'test-user-id',
      };

      (prisma.story.findFirst as jest.Mock).mockResolvedValue(existingStory);
      (prisma.story.delete as jest.Mock).mockResolvedValue(existingStory);

      await storyController.deleteStory(mockRequest as AuthRequest, mockResponse as Response);

      expect(prisma.story.findFirst).toHaveBeenCalledWith({
        where: { id: 'story-1', userId: 'test-user-id' },
      });
      expect(prisma.story.delete).toHaveBeenCalledWith({ where: { id: 'story-1' } });
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Story deleted successfully' });
    });

    it('should return 404 if story not found', async () => {
      mockRequest.params = { id: 'non-existent' };

      (prisma.story.findFirst as jest.Mock).mockResolvedValue(null);

      await storyController.deleteStory(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Story not found' });
    });

    it('should return 500 on error', async () => {
      mockRequest.params = { id: 'story-1' };

      (prisma.story.findFirst as jest.Mock).mockRejectedValue(new Error('Database error'));

      await storyController.deleteStory(mockRequest as AuthRequest, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to delete story' });
    });
  });
});

