import express from 'express';
import authMiddleware from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Mock user data
const users = [];

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authMiddleware, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        isActive: user.isActive
      }
    });
  } catch (err) {
    logger.error('Get profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authMiddleware, (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const user = users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    user.updatedAt = new Date();

    logger.info(`User profile updated: ${user.email}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (err) {
    logger.error('Update profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/users/teams
 * @desc    Get user's teams
 * @access  Private
 */
router.get('/teams', authMiddleware, (req, res) => {
  try {
    // Mock teams data
    const teams = [
      {
        id: 1,
        name: 'Marketing Team',
        role: 'admin',
        members: 5,
        createdAt: new Date()
      }
    ];

    res.json({
      success: true,
      teams
    });
  } catch (err) {
    logger.error('Get teams error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
