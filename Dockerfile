FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Generate Prisma client
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
RUN npx prisma generate

# Build the app and compile seed script to JavaScript
RUN pnpm build
RUN npx tsc prisma/seed.ts --outDir dist/prisma --esModuleInterop --skipLibCheck

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy Prisma schema and migrations
COPY prisma/schema.prisma ./prisma/
COPY prisma/migrations ./prisma/migrations/

# Generate Prisma client in production stage
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
RUN npx prisma generate

# Copy built app, JS seed script, and i18n locales from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/infrastructure/i18n/locales ./src/infrastructure/i18n/locales

# Expose port
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Run migrations, compiled seed script, and start the app
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && node dist/prisma/seed.js && node dist/src/main.js"]
