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

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy Prisma schema and seed script
COPY prisma ./prisma/

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# Copy ts-node and tsconfig-paths for running seed script
COPY --from=builder /app/node_modules/ts-node ./node_modules/ts-node
COPY --from=builder /app/node_modules/tsconfig-paths ./node_modules/tsconfig-paths
COPY --from=builder /app/node_modules/typescript ./node_modules/typescript
COPY --from=builder /app/node_modules/@types ./node_modules/@types
COPY --from=builder /app/node_modules/yn ./node_modules/yn
COPY --from=builder /app/node_modules/v8-compile-cache-lib ./node_modules/v8-compile-cache-lib
COPY --from=builder /app/node_modules/make-error ./node_modules/make-error
COPY --from=builder /app/node_modules/arg ./node_modules/arg
COPY --from=builder /app/node_modules/create-require ./node_modules/create-require
COPY --from=builder /app/node_modules/diff ./node_modules/diff
COPY --from=builder /app/node_modules/acorn-walk ./node_modules/acorn-walk
COPY --from=builder /app/node_modules/acorn ./node_modules/acorn
COPY --from=builder /app/node_modules/json5 ./node_modules/json5
COPY --from=builder /app/node_modules/minimist ./node_modules/minimist
COPY --from=builder /app/node_modules/strip-bom ./node_modules/strip-bom

# Expose port
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Run migrations and start the app
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npx ts-node -r tsconfig-paths/register prisma/seed.ts && node dist/src/main.js"]
