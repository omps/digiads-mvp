# Multi-stage Dockerfile for Node.js microservices
FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies stage
FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose ports for all services
EXPOSE 3000 3001 3002 3003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Default command - can be overridden per service
CMD ["npm", "run", "install-all"]