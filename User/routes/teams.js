import express from 'express';
import authMiddleware from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Mock teams database
const teams = [];

/**
 * @route   POST /api/teams
 * @desc    Create a new team
 * @access  Private
 */
router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const team = {
      id: teams.length + 1,
      name,
      description,
      ownerId: req.user.userId,
      members: [{ userId: req.user.userId, role: 'owner', joinedAt: new Date() }],
      createdAt: new Date()
    };

    teams.push(team);
    logger.info(`Team created: ${name} by user ${req.user.userId}`);

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      team
    });
  } catch (err) {
    logger.error('Create team error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/teams/:id
 * @desc    Get team details
 * @access  Private
 */
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const team = teams.find(t => t.id === parseInt(req.params.id));

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is member
    const isMember = team.members.some(m => m.userId === req.user.userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      team
    });
  } catch (err) {
    logger.error('Get team error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/teams/:id/members
 * @desc    Add member to team
 * @access  Private
 */
router.post('/:id/members', authMiddleware, (req, res) => {
  try {
    const { userId, role } = req.body;
    const team = teams.find(t => t.id === parseInt(req.params.id));

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if requester is owner/admin
    const requester = team.members.find(m => m.userId === req.user.userId);
    if (!requester || (requester.role !== 'owner' && requester.role !== 'admin')) {
      return res.status(403).json({ error: 'Only owners and admins can add members' });
    }

    // Check if user already member
    const existingMember = team.members.find(m => m.userId === userId);
    if (existingMember) {
      return res.status(400).json({ error: 'User is already a member' });
    }

    team.members.push({
      userId,
      role: role || 'member',
      joinedAt: new Date()
    });

    logger.info(`User ${userId} added to team ${team.id}`);

    res.json({
      success: true,
      message: 'Member added successfully',
      team
    });
  } catch (err) {
    logger.error('Add member error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
