FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY Publish/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY Publish/src ./src
COPY Publish/models ./models
COPY Publish/routes ./routes
COPY Publish/services ./services
COPY Publish/middleware ./middleware
COPY Publish/config ./config
COPY Publish/utils ./utils

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start service
CMD ["node", "src/app.js"]