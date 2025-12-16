# apps/payment-service/Dockerfile
FROM node:20-alpine AS base

# 1. Prune
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .

RUN turbo prune --scope=payment-service --docker

# 2. Install & Build
FROM base AS installer
WORKDIR /app
RUN apk add --no-cache libc6-compat
# OpenSSL is required for Prisma Client
RUN apk add --no-cache openssl

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci

COPY --from=builder /app/out/full/ .

RUN npx turbo run build --filter=payment-service

# 3. Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

COPY --from=installer --chown=nodejs:nodejs /app .

EXPOSE 8002

# Start script
CMD ["node", "apps/payment-service/src/index.js"]