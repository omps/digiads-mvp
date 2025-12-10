import logger from '../utils/logger.js';

/**
 * Request Validation Middleware
 * Validates request body against a Joi schema
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      logger.warn('Validation error:', error.details);
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    next();
  };
};

export default validate;
