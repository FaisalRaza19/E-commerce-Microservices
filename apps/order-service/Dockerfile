FROM node:18-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune order-service --docker

FROM base AS installer
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder /app/out/full/ .
# Generate Prisma Client for Order DB
WORKDIR /app/packages/order-db
RUN npx prisma generate

WORKDIR /app

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastifyjs
USER fastifyjs

COPY --from=installer /app .

CMD ["node", "apps/order-service/src/index.js"]