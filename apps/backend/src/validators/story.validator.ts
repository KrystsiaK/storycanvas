import Joi from 'joi';

export const storyValidators = {
  generateStory: Joi.object({
    character: Joi.object({
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
          'string.min': 'Character description must be at least 10 characters',
          'string.max': 'Character description cannot exceed 1000 characters',
          'any.required': 'Character description is required',
        }),
    }).required(),

    genre: Joi.string()
      .valid('Adventure', 'Fantasy', 'Mystery', 'Friendship', 'Educational', 'Bedtime', 'Sci-Fi', 'Historical')
      .required()
      .messages({
        'any.only': 'Genre must be one of: Adventure, Fantasy, Mystery, Friendship, Educational, Bedtime, Sci-Fi, Historical',
        'any.required': 'Genre is required',
      }),

    language: Joi.string()
      .valid('English', 'Spanish', 'French', 'German', 'Russian', 'Ukrainian', 'Polish', 'Italian', 'Portuguese')
      .required()
      .messages({
        'any.only': 'Language is not supported',
        'any.required': 'Language is required',
      }),

    ageGroup: Joi.string()
      .valid('3-5', '6-8', '9-12', '13-15')
      .required()
      .messages({
        'any.only': 'Age group must be one of: 3-5, 6-8, 9-12, 13-15',
        'any.required': 'Age group is required',
      }),

    theme: Joi.string()
      .max(200)
      .trim()
      .optional()
      .allow('')
      .messages({
        'string.max': 'Theme cannot exceed 200 characters',
      }),

    moralLesson: Joi.string()
      .max(300)
      .trim()
      .optional()
      .allow('')
      .messages({
        'string.max': 'Moral lesson cannot exceed 300 characters',
      }),
  }),

  updateStory: Joi.object({
    title: Joi.string()
      .min(1)
      .max(200)
      .trim()
      .optional(),
    
    content: Joi.string()
      .min(10)
      .trim()
      .optional(),
    
    theme: Joi.string()
      .max(200)
      .trim()
      .optional()
      .allow(''),
    
    moralLesson: Joi.string()
      .max(300)
      .trim()
      .optional()
      .allow(''),

    audioUrl: Joi.string()
      .uri()
      .optional()
      .allow(null),

    videoUrl: Joi.string()
      .uri()
      .optional()
      .allow(null),

    pdfUrl: Joi.string()
      .uri()
      .optional()
      .allow(null),
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update',
  }),

  storyId: Joi.object({
    id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.guid': 'Invalid story ID format',
        'any.required': 'Story ID is required',
      }),
  }),
};

