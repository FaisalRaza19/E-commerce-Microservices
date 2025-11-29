FROM node:18-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=client --scope=@repo/typescript-config --scope=@repo/eslint-config --docker

FROM base AS installer

WORKDIR /app/apps/client 

COPY --from=builder /app/out/json/apps/client/package.json ./package.json 
COPY --from=builder /app/out/package-lock.json ./package-lock.json 
COPY --from=builder /app/out/json/package.json ../../package.json 
COPY --from=builder /app/out/package-lock.json ../../package-lock.json 

RUN npm install 

COPY --from=builder /app/out/full/apps/client/ ./
COPY --from=builder /app/out/full/packages/typescript-config/ ../../packages/typescript-config/

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_ZWxlY3RyaWMtZWxlcGhhbnQtNzIuY2xlcmsuYWNjb3VudHMuZGV2JA" 

WORKDIR /app/apps/client
RUN npm run build 

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/client/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/public ./apps/client/public
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/next.config.mjs ./

CMD ["node", "server.js"]