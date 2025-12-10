import jwt from 'jsonwebtoken';
import config from 'config';
import logger from '../utils/logger.js';

/**
 * JWT Authentication Middleware
 * Verifies the JWT token and attaches user info to request
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, config.get('jwt.secret'));

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (err) {
    logger.error('Auth middleware error:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.status(500).json({ error: 'Authentication error' });
  }
};

export default authMiddleware;
