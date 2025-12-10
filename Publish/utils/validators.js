import Joi from 'joi';

export const validatePost = (data) => {
  const schema = Joi.object({
    content: Joi.string().min(1).max(5000).required(),
    platforms: Joi.array().items(Joi.string().valid('facebook', 'twitter', 'linkedin', 'instagram')).min(1).required(),
    scheduledAt: Joi.date().min('now').optional(),
    mediaUrls: Joi.array().items(Joi.string().uri()).optional()
  });

  return schema.validate(data);
};

export default { validatePost };
