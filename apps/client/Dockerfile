# apps/client/Dockerfile
FROM node:20-alpine AS base

# 1. Prune the workspace (Isolate only this app)
FROM base AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .

RUN turbo prune --scope=client --docker 

# 2. Install dependencies & Build
FROM base AS installer
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Copy the pruned lockfile and package.json
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci

# Copy the source code
COPY --from=builder /app/out/full/ .

ARG NEXT_PUBLIC_PRODUCT_SERVICE_URL
ARG NEXT_PUBLIC_ORDER_SERVICE_URL
ARG NEXT_PUBLIC_PAYMENT_SERVICE_URL
ARG NEXT_PUBLIC_AUTH_SERVICE_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL

ENV NEXT_PUBLIC_PRODUCT_SERVICE_URL=$NEXT_PUBLIC_PRODUCT_SERVICE_URL
ENV NEXT_PUBLIC_ORDER_SERVICE_URL=$NEXT_PUBLIC_ORDER_SERVICE_URL
ENV NEXT_PUBLIC_PAYMENT_SERVICE_URL=$NEXT_PUBLIC_PAYMENT_SERVICE_URL
ENV NEXT_PUBLIC_AUTH_SERVICE_URL=$NEXT_PUBLIC_AUTH_SERVICE_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL
ENV NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL

RUN npx turbo run build --filter=client

# 3. Production Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/client/.next/standalone ./
COPY --from=installer /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=installer /app/apps/client/public ./apps/client/public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/client/server.js"]