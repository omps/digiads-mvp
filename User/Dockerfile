FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY User/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY User/src ./src
COPY User/models ./models
COPY User/routes ./routes
COPY User/services ./services
COPY User/middleware ./middleware
COPY User/config ./config
COPY User/utils ./utils

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start service
CMD ["node", "src/app.js"]