# Base image
FROM node:20-alpine AS base

# Turbo-prune stage: prune monorepo for client
FROM base AS turbo-prune
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN npm install -g turbo

COPY turbo.json package.json package-lock.json ./
COPY apps ./apps
COPY packages ./packages

RUN turbo prune --scope=client --docker

# Installer stage: install dependencies and build client
FROM node:20-alpine AS installer

WORKDIR /app

# Copy pruned output
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=installer /app/out/package-lock.json ./package-lock.json

RUN npm install
COPY --from=builder /app/out/full/ .

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_ZWxlY3RyaWMtZWxlcGhhbnQtNzIuY2xlcmsuYWNjb3VudHMuZGV2JA" 

WORKDIR /app/apps/client
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy build output from installer
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/.next/standalone ./ 
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/public ./apps/client/public

USER nextjs
EXPOSE 3000

CMD ["node", "apps/client/server.js"]
