# apps/email-service/Dockerfile
FROM node:20-alpine AS base

# 1. Prune
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .

RUN turbo prune --scope=email-service --docker

# 2. Install & Setup
FROM base AS installer
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci

COPY --from=builder /app/out/full/ .

# 3. Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

COPY --from=installer --chown=expressjs:expressjs /app .

EXPOSE 8004 

CMD ["node", "apps/email-service/src/index.js"]