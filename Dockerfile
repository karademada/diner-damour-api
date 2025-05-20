FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app and compile seed script to JavaScript
RUN npm run build && \
    npx tsc prisma/seed.ts --outDir dist/prisma --esModuleInterop --skipLibCheck

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy Prisma schema (no need for seed.ts as we'll use the JS version)
COPY prisma/schema.prisma ./prisma/
COPY prisma/migrations ./prisma/migrations/

# Copy built app and JS seed script from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Run migrations, compiled seed script, and start the app
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && node dist/prisma/seed.js && node dist/src/main.js"]
