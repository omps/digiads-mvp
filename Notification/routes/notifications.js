import express from 'express';
import authMiddleware from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Mock notifications database
const notifications = [];

/**
 * @route   POST /api/notifications/send
 * @desc    Send notification to user(s)
 * @access  Private
 */
router.post('/send', authMiddleware, (req, res) => {
  try {
    const { userId, type, title, message, data } = req.body;

    if (!userId || !type || !message) {
      return res.status(400).json({ error: 'userId, type, and message are required' });
    }

    const notification = {
      id: notifications.length + 1,
      userId,
      type,
      title,
      message,
      data: data || {},
      read: false,
      createdAt: new Date()
    };

    notifications.push(notification);

    // Send via Socket.IO
    const io = req.app.get('io');
    io.to(`user:${userId}`).emit('notification', notification);

    logger.info(`Notification sent to user ${userId}: ${type}`);

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      notification
    });
  } catch (err) {
    logger.error('Send notification error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/notifications
 * @desc    Get user notifications
 * @access  Private
 */
router.get('/', authMiddleware, (req, res) => {
  try {
    const userNotifications = notifications
      .filter(n => n.userId === req.user.userId)
      .sort((a, b) => b.createdAt - a.createdAt);

    const unreadCount = userNotifications.filter(n => !n.read).length;

    res.json({
      success: true,
      count: userNotifications.length,
      unreadCount,
      notifications: userNotifications
    });
  } catch (err) {
    logger.error('Get notifications error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read', authMiddleware, (req, res) => {
  try {
    const notification = notifications.find(
      n => n.id === parseInt(req.params.id) && n.userId === req.user.userId
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.read = true;
    notification.readAt = new Date();

    res.json({
      success: true,
      message: 'Notification marked as read',
      notification
    });
  } catch (err) {
    logger.error('Mark read error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read-all', authMiddleware, (req, res) => {
  try {
    const userNotifications = notifications.filter(n => n.userId === req.user.userId && !n.read);

    userNotifications.forEach(n => {
      n.read = true;
      n.readAt = new Date();
    });

    res.json({
      success: true,
      message: 'All notifications marked as read',
      count: userNotifications.length
    });
  } catch (err) {
    logger.error('Mark all read error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const notificationIndex = notifications.findIndex(
      n => n.id === parseInt(req.params.id) && n.userId === req.user.userId
    );

    if (notificationIndex === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notifications.splice(notificationIndex, 1);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (err) {
    logger.error('Delete notification error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/notifications/broadcast
 * @desc    Broadcast notification to all users
 * @access  Private (Admin only in production)
 */
router.post('/broadcast', authMiddleware, (req, res) => {
  try {
    const { type, title, message, data } = req.body;

    if (!type || !message) {
      return res.status(400).json({ error: 'type and message are required' });
    }

    const broadcast = {
      id: notifications.length + 1,
      type,
      title,
      message,
      data: data || {},
      broadcast: true,
      createdAt: new Date()
    };

    // Send via Socket.IO to all connected clients
    const io = req.app.get('io');
    io.emit('broadcast', broadcast);

    logger.info(`Broadcast notification sent: ${type}`);

    res.status(201).json({
      success: true,
      message: 'Broadcast sent successfully',
      broadcast
    });
  } catch (err) {
    logger.error('Broadcast error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
