const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const postsRoutes = require('../routes/posts');
const accountsRoutes = require('../routes/accounts');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'publish-service' });
});

// API Documentation
app.get('/api-docs', (req, res) => {
  res.json({
    service: 'Publish Service',
    version: '1.0.0',
    endpoints: {
      posts: '/api/posts',
      accounts: '/api/accounts'
    }
  });
});

// Routes
app.use('/api/posts', postsRoutes);
app.use('/api/accounts', accountsRoutes);

// Error handling
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Publish Service running on port ${PORT}`);
});

module.exports = app;