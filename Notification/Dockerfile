FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY Notification/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY Notification/src ./src
COPY Notification/models ./models
COPY Notification/routes ./routes
COPY Notification/services ./services
COPY Notification/middleware ./middleware
COPY Notification/config ./config
COPY Notification/utils ./utils

# Expose port
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3003/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start service
CMD ["node", "src/app.js"]