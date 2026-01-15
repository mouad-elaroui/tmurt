# Production Dockerfile for Medusa Backend
# Optimized for Railway deployment with fast build times

FROM node:20-alpine

# Set production environment
ENV NODE_ENV=production
ENV DISABLE_ADMIN=true

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./

# Install production dependencies only (skip devDependencies)
RUN npm ci --omit=dev --ignore-scripts 2>/dev/null || npm install --omit=dev --ignore-scripts

# Copy application source
COPY . .

# Expose port
EXPOSE 9000

# Start command (db:migrate runs before start)
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
