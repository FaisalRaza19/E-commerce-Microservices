FROM node:20-alpine AS base

FROM base AS turbo-prune
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN npm install -g turbo

COPY turbo.json ./
COPY package.json ./
COPY package-lock.json ./
COPY apps ./apps
COPY packages ./packages

RUN turbo prune --scope=client --docker

FROM base AS installer
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY --from=turbo-prune /app/out/json/ ./
COPY --from=turbo-prune /app/out/package-lock.json ./package-lock.json

RUN rm -f apps/client/package-lock.json

RUN npm install

COPY --from=turbo-prune /app/out/full/ ./

RUN echo "module.exports = { turbopack: false }" > apps/client/next.config.js

# build
RUN npm run build -w apps/client

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/client/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/public ./apps/client/public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
