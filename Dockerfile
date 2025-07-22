FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ gcc libc6-compat

# Copy package.json
COPY package.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm install

# Copy the rest of the app
COPY . .

# Generate Prisma client
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
RUN npx prisma generate

# Build the app and compile seed script to JavaScript
RUN npm run build
RUN npx tsc prisma/seed.ts --outDir dist/prisma --esModuleInterop --skipLibCheck

FROM node:20-alpine AS production

WORKDIR /app

# Install build dependencies for native modules (keep them for runtime)
RUN apk add --no-cache python3 make g++ gcc libc6-compat

# Copy package.json
COPY package.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy Prisma schema and migrations
COPY prisma/schema.prisma ./prisma/
COPY prisma/migrations ./prisma/migrations/

# Generate Prisma client in production stage
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
RUN npx prisma generate

# Copy built app and i18n locales from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/infrastructure/i18n/locales ./src/infrastructure/i18n/locales

# Expose port
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Run migrations, compiled seed script, and start the app
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && node dist/prisma/seed.js && node dist/src/main.js"]
