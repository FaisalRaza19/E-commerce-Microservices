FROM node:20-alpine AS base

# 1. Prune the workspace
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .

RUN turbo prune --scope=payment-service --docker

# 2. Install Dependencies
FROM base AS installer
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci

COPY --from=builder /app/out/full/ .

RUN npx turbo run build --filter=payment-service

# 4. Production Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

# Copy the application code from the installer stage
COPY --from=installer --chown=expressjs:expressjs /app .

EXPOSE 8002

CMD ["node", "apps/payment-service/src/index.js"]