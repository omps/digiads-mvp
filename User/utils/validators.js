import Joi from 'joi';

/**
 * User Registration Validation Schema
 */
export const validateRegister = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
    firstName: Joi.string().min(2).max(50).required().messages({
      'string.min': 'First name must be at least 2 characters',
      'any.required': 'First name is required'
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Last name must be at least 2 characters',
      'any.required': 'Last name is required'
    })
  });

  return schema.validate(data);
};

/**
 * User Login Validation Schema
 */
export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  });

  return schema.validate(data);
};

/**
 * Post Creation Validation Schema
 */
export const validatePost = (data) => {
  const schema = Joi.object({
    content: Joi.string().min(1).max(5000).required().messages({
      'string.min': 'Post content cannot be empty',
      'string.max': 'Post content is too long',
      'any.required': 'Post content is required'
    }),
    platforms: Joi.array().items(Joi.string().valid('facebook', 'twitter', 'linkedin', 'instagram')).min(1).required().messages({
      'array.min': 'At least one platform must be selected',
      'any.required': 'Platforms are required'
    }),
    scheduledAt: Joi.date().min('now').optional().messages({
      'date.min': 'Scheduled time must be in the future'
    }),
    mediaUrls: Joi.array().items(Joi.string().uri()).optional()
  });

  return schema.validate(data);
};

/**
 * Team Creation Validation Schema
 */
export const validateTeam = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      'string.min': 'Team name must be at least 3 characters',
      'any.required': 'Team name is required'
    }),
    description: Joi.string().max(500).optional()
  });

  return schema.validate(data);
};

export default {
  validateRegister,
  validateLogin,
  validatePost,
  validateTeam
};
