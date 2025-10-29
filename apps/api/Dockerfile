# API Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN cd apps/api && npx prisma generate

# Build shared package
RUN cd packages/shared && npm run build

# Build API
RUN cd apps/api && npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV TZ=Africa/Monrovia

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built app
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 4000

WORKDIR /app/apps/api

CMD ["node", "dist/main"]
