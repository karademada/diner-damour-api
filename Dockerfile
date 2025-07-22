FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ gcc libc6-compat

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

# Clean up dev dependencies but keep production ones with native bindings
RUN pnpm prune --prod

FROM node:20-alpine AS production

WORKDIR /app

# Install minimal runtime dependencies
RUN apk add --no-cache libc6-compat

# Copy package.json for reference
COPY package.json ./

# Copy Prisma schema and migrations
COPY prisma/schema.prisma ./prisma/
COPY prisma/migrations ./prisma/migrations/

# Copy built app, node_modules (with native bindings), and i18n locales from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/infrastructure/i18n/locales ./src/infrastructure/i18n/locales

# Expose port
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Run migrations, compiled seed script, and start the app
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && node dist/prisma/seed.js && node dist/src/main.js"]
