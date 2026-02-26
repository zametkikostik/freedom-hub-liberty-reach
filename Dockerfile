# ─────────────────────────────────────────────────────────────────────────────
# Freedom Hub Node - Production Docker Image
# ─────────────────────────────────────────────────────────────────────────────

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Production stage
# ─────────────────────────────────────────────────────────────────────────────

FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache \
    dumb-init \
    curl \
    openssl \
    ca-certificates

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /var/lib/freedom-node

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

# Create directories for storage and logs
RUN mkdir -p /var/lib/freedom-node/storage /var/log/freedom-node && \
    chown -R nodejs:nodejs /var/lib/freedom-node /var/log/freedom-node

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/server.js"]
