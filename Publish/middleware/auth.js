import jwt from 'jsonwebtoken';
import config from 'config';
import logger from '../utils/logger.js';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.get('jwt.secret'));
    req.user = decoded;
    next();
  } catch (err) {
    logger.error('Auth middleware error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;
