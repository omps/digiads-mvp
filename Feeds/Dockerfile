FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY Feeds/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY Feeds/src ./src
COPY Feeds/models ./models
COPY Feeds/routes ./routes
COPY Feeds/services ./services
COPY Feeds/middleware ./middleware
COPY Feeds/config ./config
COPY Feeds/utils ./utils

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start service
CMD ["node", "src/app.js"]