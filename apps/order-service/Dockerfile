FROM node:18-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
# Prune the workspace for the order-service
RUN turbo prune order-service --docker

FROM base AS installer
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder /app/out/full/ .

WORKDIR /app

FROM base AS runner
WORKDIR /app
# Use a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastifyjs
USER fastifyjs

# Copy all pruned and installed files from the installer stage
COPY --from=installer /app .

# Start the Fastify application
CMD ["node", "apps/order-service/src/index.js"]