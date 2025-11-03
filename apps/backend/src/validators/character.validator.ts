import { z } from 'zod';

/**
 * Validation schemas for character endpoints
 */

export const CreateCharacterSchema = z.object({
  name: z.string()
    .min(1, 'Character name is required')
    .max(50, 'Character name must not exceed 50 characters')
    .trim(),
  description: z.string()
    .min(10, 'Character description must be at least 10 characters')
    .max(500, 'Character description must not exceed 500 characters')
    .trim(),
  generateImage: z.boolean()
    .default(false)
    .optional(),
});

export const UpdateCharacterSchema = z.object({
  name: z.string()
    .min(1, 'Character name must not be empty')
    .max(50, 'Character name must not exceed 50 characters')
    .trim()
    .optional(),
  description: z.string()
    .min(10, 'Character description must be at least 10 characters')
    .max(500, 'Character description must not exceed 500 characters')
    .trim()
    .optional(),
  imageUrl: z.string()
    .url('Invalid image URL')
    .optional(),
});

export const CharacterIdSchema = z.object({
  id: z.string().uuid('Invalid character ID format'),
});

export type CreateCharacterDTO = z.infer<typeof CreateCharacterSchema>;
export type UpdateCharacterDTO = z.infer<typeof UpdateCharacterSchema>;
export type CharacterIdDTO = z.infer<typeof CharacterIdSchema>;


