FROM node:18-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune client --docker

FROM base AS installer
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder /app/out/full/ .

# 3. RUN THE BUILD FROM THE CLIENT'S DIRECTORY
WORKDIR /app/apps/client
RUN npm run build 

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# The Next.js official recommended COPY steps
# NOTE: Paths must be relative to the new WORKDIR (/app/apps/client) where the build ran

# Copy files necessary for running the standalone server
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/next.config.mjs ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/package.json ./

# Copy Next.js outputs (must be from the source path where the build occurred)
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/public ./apps/client/public

CMD ["node", "server.js"]