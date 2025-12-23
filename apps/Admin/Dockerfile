# apps/Admin/Dockerfile
FROM node:20-alpine AS base

# 1. Prune the workspace (Isolate only this app)
FROM base AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .

RUN turbo prune --scope=admin --docker 

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

# --- ARGS INJECTION START ---
ARG NEXT_PUBLIC_PRODUCT_SERVICE_URL
ARG NEXT_PUBLIC_ORDER_SERVICE_URL
ARG NEXT_PUBLIC_PAYMENT_SERVICE_URL
ARG NEXT_PUBLIC_AUTH_SERVICE_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

ENV NEXT_PUBLIC_PRODUCT_SERVICE_URL=$NEXT_PUBLIC_PRODUCT_SERVICE_URL
ENV NEXT_PUBLIC_ORDER_SERVICE_URL=$NEXT_PUBLIC_ORDER_SERVICE_URL
ENV NEXT_PUBLIC_PAYMENT_SERVICE_URL=$NEXT_PUBLIC_PAYMENT_SERVICE_URL
ENV NEXT_PUBLIC_AUTH_SERVICE_URL=$NEXT_PUBLIC_AUTH_SERVICE_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
# --- ARGS INJECTION END ---

RUN npx turbo run build --filter=admin

# 3. Production Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/Admin/.next/standalone ./
COPY --from=installer /app/apps/Admin/.next/static ./apps/Admin/.next/static
COPY --from=installer /app/apps/Admin/public ./apps/Admin/public

EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/Admin/server.js"] 
