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

# Installer stage
FROM base AS installer
WORKDIR /app

# Copy pruned output
COPY --from=turbo-prune /app/out/json/ ./
COPY --from=turbo-prune /app/out/package-lock.json ./package-lock.json
COPY --from=turbo-prune /app/out/full/ ./

# Install dependencies for the whole workspace
RUN npm install

# Switch to client directory before build
WORKDIR /app/apps/client
# Copy client source code if needed
COPY apps/client ./

# Build client explicitly using webpack
RUN npm run build -- --webpack

# Runner stage: lightweight production image
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
