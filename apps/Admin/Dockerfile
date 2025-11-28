FROM node:18-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune admin --docker

FROM base AS installer
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder /app/out/full/ .
RUN npx turbo run build --filter=admin...

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/Admin/next.config.mjs .
COPY --from=installer /app/apps/Admin/package.json .

# Automatically leverage output traces to reduce image size
COPY --from=installer --chown=nextjs:nodejs /app/apps/Admin/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/Admin/.next/static ./apps/Admin/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/Admin/public ./apps/Admin/public

CMD ["node", "apps/Admin/server.js"]