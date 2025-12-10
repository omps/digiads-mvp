const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIO = require('socket.io');
const logger = require('./utils/logger');
const notificationsRoutes = require('../routes/notifications');
const emailRoutes = require('../routes/email');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'notification-service' });
});

// API Documentation
app.get('/api-docs', (req, res) => {
  res.json({
    service: 'Notification Service',
    version: '1.0.0',
    endpoints: {
      notifications: '/api/notifications',
      email: '/api/email'
    },
    realtime: 'Socket.IO available'
  });
});

// Routes
app.use('/api/notifications', notificationsRoutes);
app.use('/api/email', emailRoutes);

// Socket.IO
io.on('connection', (socket) => {
  logger.info('Client connected:', socket.id);

  socket.on('disconnect', () => {
    logger.info('Client disconnected:', socket.id);
  });

  socket.on('subscribe', (userId) => {
    socket.join(`user_${userId}`);
    logger.info('User subscribed:', userId);
  });
});

// Export io for use in routes
app.set('io', io);

// Error handling
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  logger.info(`Notification Service running on port ${PORT}`);
});

module.exports = app;