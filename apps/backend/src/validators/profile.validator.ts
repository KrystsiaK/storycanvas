import Joi from 'joi';

const updateProfile = Joi.object({
  name: Joi.string().min(2).max(100).trim().optional(),
  email: Joi.string().email().lowercase().trim().optional(),
  avatar: Joi.string().uri().allow(null, '').optional(),
  currentPassword: Joi.string().optional(),
  newPassword: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .optional()
    .messages({
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
      'string.min': 'New password must be at least 8 characters long',
    }),
}).min(1); // At least one field must be provided

const deleteAccount = Joi.object({
  password: Joi.string().required().messages({
    'any.required': 'Password is required to delete account',
  }),
});

export const profileValidators = {
  updateProfile,
  deleteAccount,
};

