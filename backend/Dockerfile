# Production Dockerfile for Medusa Backend
# Optimized for Railway deployment with fast build times

FROM node:20-alpine

# Set environment variables
ENV NODE_ENV=production
ENV DISABLE_ADMIN=true

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./

# Install ALL dependencies (needed for build)
RUN npm install --legacy-peer-deps

# Copy application source
COPY . .

# Build Medusa (with admin disabled, this is fast)
RUN npm run build

# Expose port (Railway provides PORT env var)
EXPOSE 9000

# Start command (db:migrate runs before start)
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
