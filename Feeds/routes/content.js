import express from 'express';
import authMiddleware from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Mock content library
const contentLibrary = [];

/**
 * @route   POST /api/content
 * @desc    Save content to library
 * @access  Private
 */
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, url, description, imageUrl, tags } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }

    const content = {
      id: contentLibrary.length + 1,
      userId: req.user.userId,
      title,
      url,
      description,
      imageUrl,
      tags: tags || [],
      savedAt: new Date(),
      isFavorite: false
    };

    contentLibrary.push(content);
    logger.info(`Content saved: ${title} by user ${req.user.userId}`);

    res.status(201).json({
      success: true,
      message: 'Content saved successfully',
      content
    });
  } catch (err) {
    logger.error('Save content error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/content
 * @desc    Get saved content library
 * @access  Private
 */
router.get('/', authMiddleware, (req, res) => {
  try {
    const userContent = contentLibrary.filter(c => c.userId === req.user.userId);

    res.json({
      success: true,
      count: userContent.length,
      content: userContent
    });
  } catch (err) {
    logger.error('Get content error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/content/:id/favorite
 * @desc    Toggle favorite status
 * @access  Private
 */
router.put('/:id/favorite', authMiddleware, (req, res) => {
  try {
    const content = contentLibrary.find(
      c => c.id === parseInt(req.params.id) && c.userId === req.user.userId
    );

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    content.isFavorite = !content.isFavorite;

    res.json({
      success: true,
      message: content.isFavorite ? 'Added to favorites' : 'Removed from favorites',
      content
    });
  } catch (err) {
    logger.error('Toggle favorite error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/content/:id
 * @desc    Delete content from library
 * @access  Private
 */
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const contentIndex = contentLibrary.findIndex(
      c => c.id === parseInt(req.params.id) && c.userId === req.user.userId
    );

    if (contentIndex === -1) {
      return res.status(404).json({ error: 'Content not found' });
    }

    contentLibrary.splice(contentIndex, 1);

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (err) {
    logger.error('Delete content error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
