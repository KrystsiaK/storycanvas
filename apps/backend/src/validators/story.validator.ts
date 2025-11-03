import { z } from 'zod';

/**
 * Validation schemas for story endpoints
 */

const CharacterSchema = z.object({
  name: z.string()
    .min(1, 'Character name is required')
    .max(50, 'Character name must not exceed 50 characters')
    .trim(),
  description: z.string()
    .min(10, 'Character description must be at least 10 characters')
    .max(500, 'Character description must not exceed 500 characters')
    .trim(),
});

const GenreEnum = z.enum([
  'Adventure',
  'Fantasy',
  'Mystery',
  'Friendship',
  'Educational',
  'Bedtime',
  'Sci-Fi',
  'Fairy Tale',
]);

const AgeGroupEnum = z.enum([
  '3-5',
  '6-8',
  '9-12',
]);

export const GenerateStorySchema = z.object({
  character: CharacterSchema,
  genre: GenreEnum,
  language: z.string()
    .length(2, 'Language must be ISO 639-1 code (2 characters)')
    .toLowerCase(),
  ageGroup: AgeGroupEnum,
  theme: z.string()
    .max(100, 'Theme must not exceed 100 characters')
    .trim()
    .optional(),
  moralLesson: z.string()
    .max(200, 'Moral lesson must not exceed 200 characters')
    .trim()
    .optional(),
});

export const UpdateStorySchema = z.object({
  title: z.string()
    .min(1, 'Title must not be empty')
    .max(200, 'Title must not exceed 200 characters')
    .trim()
    .optional(),
  content: z.string()
    .min(1, 'Content must not be empty')
    .optional(),
  theme: z.string()
    .max(100, 'Theme must not exceed 100 characters')
    .trim()
    .optional(),
  moralLesson: z.string()
    .max(200, 'Moral lesson must not exceed 200 characters')
    .trim()
    .optional(),
});

export const StoryIdSchema = z.object({
  id: z.string().uuid('Invalid story ID format'),
});

export type GenerateStoryDTO = z.infer<typeof GenerateStorySchema>;
export type UpdateStoryDTO = z.infer<typeof UpdateStorySchema>;
export type StoryIdDTO = z.infer<typeof StoryIdSchema>;
export type CharacterDTO = z.infer<typeof CharacterSchema>;
export type Genre = z.infer<typeof GenreEnum>;
export type AgeGroup = z.infer<typeof AgeGroupEnum>;


