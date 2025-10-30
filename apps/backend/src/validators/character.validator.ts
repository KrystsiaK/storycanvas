import Joi from 'joi';

export const characterValidators = {
  generateCharacter: Joi.object({
    name: Joi.string()
      .min(1)
      .max(100)
      .trim()
      .required()
      .messages({
        'string.min': 'Character name must not be empty',
        'string.max': 'Character name cannot exceed 100 characters',
        'any.required': 'Character name is required',
      }),
    
    description: Joi.string()
      .min(10)
      .max(1000)
      .trim()
      .required()
      .messages({
        'string.min': 'Description must be at least 10 characters',
        'string.max': 'Description cannot exceed 1000 characters',
        'any.required': 'Description is required',
      }),
  }),

  characterId: Joi.object({
    id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.guid': 'Invalid character ID format',
        'any.required': 'Character ID is required',
      }),
  }),
};

