import { describe, it, expect } from 'vitest';
import { GenerateStorySchema, UpdateStorySchema } from '../story.validator';

describe('Story Validators', () => {
  describe('GenerateStorySchema', () => {
    it('should validate correct story generation data', () => {
      const validData = {
        character: {
          name: 'Luna',
          description: 'A brave space explorer who loves adventures',
        },
        genre: 'Adventure',
        language: 'en',
        ageGroup: '6-8',
        theme: 'Courage and friendship',
        moralLesson: 'Never give up on your dreams',
      };

      const result = GenerateStorySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject short character description', () => {
      const invalidData = {
        character: {
          name: 'Luna',
          description: 'Short',
        },
        genre: 'Adventure',
        language: 'en',
        ageGroup: '6-8',
      };

      const result = GenerateStorySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid genre', () => {
      const invalidData = {
        character: {
          name: 'Luna',
          description: 'A brave space explorer',
        },
        genre: 'InvalidGenre',
        language: 'en',
        ageGroup: '6-8',
      };

      const result = GenerateStorySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid age group', () => {
      const invalidData = {
        character: {
          name: 'Luna',
          description: 'A brave space explorer',
        },
        genre: 'Adventure',
        language: 'en',
        ageGroup: '13-15',
      };

      const result = GenerateStorySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid language code', () => {
      const invalidData = {
        character: {
          name: 'Luna',
          description: 'A brave space explorer',
        },
        genre: 'Adventure',
        language: 'english',
        ageGroup: '6-8',
      };

      const result = GenerateStorySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should make theme and moralLesson optional', () => {
      const validData = {
        character: {
          name: 'Luna',
          description: 'A brave space explorer',
        },
        genre: 'Adventure',
        language: 'en',
        ageGroup: '6-8',
      };

      const result = GenerateStorySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('UpdateStorySchema', () => {
    it('should validate partial updates', () => {
      const validData = {
        title: 'Updated Title',
      };

      const result = UpdateStorySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should allow empty update object', () => {
      const validData = {};

      const result = UpdateStorySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const invalidData = {
        title: '',
      };

      const result = UpdateStorySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject too long title', () => {
      const invalidData = {
        title: 'a'.repeat(201),
      };

      const result = UpdateStorySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

