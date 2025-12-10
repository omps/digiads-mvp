import express from 'express';
import authMiddleware from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Mock feed sources
const feedSources = [];
const feeds = [];

/**
 * @route   POST /api/feeds/sources
 * @desc    Add RSS feed source
 * @access  Private
 */
router.post('/sources', authMiddleware, (req, res) => {
  try {
    const { url, name, category } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Feed URL is required' });
    }

    const feedSource = {
      id: feedSources.length + 1,
      userId: req.user.userId,
      url,
      name: name || url,
      category: category || 'general',
      isActive: true,
      addedAt: new Date()
    };

    feedSources.push(feedSource);
    logger.info(`Feed source added: ${url} by user ${req.user.userId}`);

    res.status(201).json({
      success: true,
      message: 'Feed source added successfully',
      feedSource
    });
  } catch (err) {
    logger.error('Add feed source error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/feeds/sources
 * @desc    Get all feed sources
 * @access  Private
 */
router.get('/sources', authMiddleware, (req, res) => {
  try {
    const userSources = feedSources.filter(s => s.userId === req.user.userId);

    res.json({
      success: true,
      count: userSources.length,
      sources: userSources
    });
  } catch (err) {
    logger.error('Get feed sources error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/feeds
 * @desc    Get aggregated feeds
 * @access  Private
 */
router.get('/', authMiddleware, (req, res) => {
  try {
    const { category, limit = 20 } = req.query;

    // Mock feed items
    let feedItems = [
      {
        id: 1,
        title: 'Sample Feed Item 1',
        description: 'This is a sample feed item from RSS',
        url: 'https://example.com/article1',
        source: 'Example Blog',
        category: 'technology',
        publishedAt: new Date(),
        imageUrl: 'https://via.placeholder.com/400x300'
      },
      {
        id: 2,
        title: 'Sample Feed Item 2',
        description: 'Another interesting article',
        url: 'https://example.com/article2',
        source: 'Tech News',
        category: 'business',
        publishedAt: new Date(),
        imageUrl: 'https://via.placeholder.com/400x300'
      }
    ];

    if (category) {
      feedItems = feedItems.filter(f => f.category === category);
    }

    feedItems = feedItems.slice(0, parseInt(limit));

    res.json({
      success: true,
      count: feedItems.length,
      feeds: feedItems
    });
  } catch (err) {
    logger.error('Get feeds error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/feeds/trending
 * @desc    Get trending content
 * @access  Private
 */
router.get('/trending', authMiddleware, (req, res) => {
  try {
    // Mock trending content
    const trendingItems = [
      {
        id: 1,
        title: 'Trending Topic 1',
        description: 'Popular content right now',
        url: 'https://example.com/trending1',
        engagement: 1500,
        platform: 'twitter',
        trendingScore: 95
      },
      {
        id: 2,
        title: 'Trending Topic 2',
        description: 'Viral content',
        url: 'https://example.com/trending2',
        engagement: 2300,
        platform: 'facebook',
        trendingScore: 88
      }
    ];

    res.json({
      success: true,
      count: trendingItems.length,
      trending: trendingItems
    });
  } catch (err) {
    logger.error('Get trending error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/feeds/sources/:id
 * @desc    Remove feed source
 * @access  Private
 */
router.delete('/sources/:id', authMiddleware, (req, res) => {
  try {
    const sourceIndex = feedSources.findIndex(
      s => s.id === parseInt(req.params.id) && s.userId === req.user.userId
    );

    if (sourceIndex === -1) {
      return res.status(404).json({ error: 'Feed source not found' });
    }

    feedSources.splice(sourceIndex, 1);
    logger.info(`Feed source deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: 'Feed source removed successfully'
    });
  } catch (err) {
    logger.error('Delete feed source error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
