import express from 'express';
import authMiddleware from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Mock subscriptions database
const subscriptions = [];

/**
 * @route   GET /api/payments/plans
 * @desc    Get available subscription plans
 * @access  Public
 */
router.get('/plans', (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: ['3 Social Accounts', 'Basic Analytics', '10 Scheduled Posts/month'],
        limits: { accounts: 3, posts: 10 }
      },
      {
        id: 'pro',
        name: 'Professional',
        price: 29,
        features: ['10 Social Accounts', 'Advanced Analytics', 'Unlimited Posts', 'Team Collaboration'],
        limits: { accounts: 10, posts: -1 }
      },
      {
        id: 'business',
        name: 'Business',
        price: 99,
        features: ['Unlimited Accounts', 'Premium Analytics', 'Unlimited Posts', 'White Label', 'Priority Support'],
        limits: { accounts: -1, posts: -1 }
      }
    ];

    res.json({
      success: true,
      plans
    });
  } catch (err) {
    logger.error('Get plans error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/payments/subscribe
 * @desc    Subscribe to a plan
 * @access  Private
 */
router.post('/subscribe', authMiddleware, (req, res) => {
  try {
    const { planId, paymentMethod } = req.body;

    if (!planId) {
      return res.status(400).json({ error: 'Plan ID is required' });
    }

    // Mock subscription creation
    const subscription = {
      id: subscriptions.length + 1,
      userId: req.user.userId,
      planId,
      status: 'active',
      startDate: new Date(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      paymentMethod: paymentMethod || 'stripe'
    };

    subscriptions.push(subscription);
    logger.info(`User ${req.user.userId} subscribed to plan ${planId}`);

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      subscription
    });
  } catch (err) {
    logger.error('Subscribe error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/payments/subscription
 * @desc    Get current subscription
 * @access  Private
 */
router.get('/subscription', authMiddleware, (req, res) => {
  try {
    const subscription = subscriptions.find(s => s.userId === req.user.userId && s.status === 'active');

    if (!subscription) {
      return res.json({
        success: true,
        subscription: null,
        message: 'No active subscription'
      });
    }

    res.json({
      success: true,
      subscription
    });
  } catch (err) {
    logger.error('Get subscription error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/payments/subscription
 * @desc    Cancel subscription
 * @access  Private
 */
router.delete('/subscription', authMiddleware, (req, res) => {
  try {
    const subscription = subscriptions.find(s => s.userId === req.user.userId && s.status === 'active');

    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    subscription.status = 'canceled';
    subscription.canceledAt = new Date();

    logger.info(`User ${req.user.userId} canceled subscription`);

    res.json({
      success: true,
      message: 'Subscription canceled successfully'
    });
  } catch (err) {
    logger.error('Cancel subscription error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
