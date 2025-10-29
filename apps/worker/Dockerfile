# Worker Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/worker/package.json ./apps/worker/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build shared package
RUN cd packages/shared && npm run build

# Build worker
RUN cd apps/worker && npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV TZ=Africa/Monrovia

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 worker

COPY --from=builder /app/apps/worker/dist ./apps/worker/dist
COPY --from=builder /app/apps/worker/node_modules ./apps/worker/node_modules
COPY --from=builder /app/apps/worker/package.json ./apps/worker/
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

RUN chown -R worker:nodejs /app

USER worker

WORKDIR /app/apps/worker

CMD ["node", "dist/index.js"]
