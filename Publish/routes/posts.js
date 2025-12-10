import express from 'express';
import authMiddleware from '../middleware/auth.js';
import logger from '../utils/logger.js';
import { validatePost } from '../utils/validators.js';

const router = express.Router();

// Mock posts database
const posts = [];

/**
 * @route   POST /api/posts
 * @desc    Create/schedule a social media post
 * @access  Private
 */
router.post('/', authMiddleware, (req, res) => {
  try {
    const { error } = validatePost(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { content, platforms, scheduledAt, mediaUrls } = req.body;

    const post = {
      id: posts.length + 1,
      userId: req.user.userId,
      content,
      platforms,
      scheduledAt: scheduledAt || null,
      mediaUrls: mediaUrls || [],
      status: scheduledAt ? 'scheduled' : 'draft',
      createdAt: new Date(),
      publishedAt: null
    };

    posts.push(post);
    logger.info(`Post created: ${post.id} by user ${req.user.userId}`);

    res.status(201).json({
      success: true,
      message: scheduledAt ? 'Post scheduled successfully' : 'Post created as draft',
      post
    });
  } catch (err) {
    logger.error('Create post error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/posts
 * @desc    Get all posts for user
 * @access  Private
 */
router.get('/', authMiddleware, (req, res) => {
  try {
    const userPosts = posts.filter(p => p.userId === req.user.userId);

    res.json({
      success: true,
      count: userPosts.length,
      posts: userPosts
    });
  } catch (err) {
    logger.error('Get posts error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/posts/:id
 * @desc    Get specific post
 * @access  Private
 */
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const post = posts.find(p => p.id === parseInt(req.params.id));

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      post
    });
  } catch (err) {
    logger.error('Get post error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/posts/:id
 * @desc    Update post
 * @access  Private
 */
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const post = posts.find(p => p.id === parseInt(req.params.id));

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { content, platforms, scheduledAt, mediaUrls } = req.body;

    if (content) post.content = content;
    if (platforms) post.platforms = platforms;
    if (scheduledAt !== undefined) post.scheduledAt = scheduledAt;
    if (mediaUrls) post.mediaUrls = mediaUrls;
    post.updatedAt = new Date();

    logger.info(`Post updated: ${post.id}`);

    res.json({
      success: true,
      message: 'Post updated successfully',
      post
    });
  } catch (err) {
    logger.error('Update post error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete post
 * @access  Private
 */
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));

    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (posts[postIndex].userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    posts.splice(postIndex, 1);
    logger.info(`Post deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (err) {
    logger.error('Delete post error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/posts/:id/publish
 * @desc    Publish post immediately
 * @access  Private
 */
router.post('/:id/publish', authMiddleware, (req, res) => {
  try {
    const post = posts.find(p => p.id === parseInt(req.params.id));

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Mock publishing logic
    post.status = 'published';
    post.publishedAt = new Date();

    logger.info(`Post published: ${post.id} to platforms: ${post.platforms.join(', ')}`);

    res.json({
      success: true,
      message: 'Post published successfully',
      post
    });
  } catch (err) {
    logger.error('Publish post error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
