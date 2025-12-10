const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const feedsRoutes = require('../routes/feeds');
const contentRoutes = require('../routes/content');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'feeds-service' });
});

// API Documentation
app.get('/api-docs', (req, res) => {
  res.json({
    service: 'Feeds Service',
    version: '1.0.0',
    endpoints: {
      feeds: '/api/feeds',
      content: '/api/content'
    }
  });
});

// Routes
app.use('/api/feeds', feedsRoutes);
app.use('/api/content', contentRoutes);

// Error handling
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  logger.info(`Feeds Service running on port ${PORT}`);
});

module.exports = app;