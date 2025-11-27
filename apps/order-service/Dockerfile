# Builder stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy app from builder
COPY --from=builder /app ./

# Expose port
EXPOSE 8001

# Set production environment
ENV NODE_ENV=production

# Run the service
CMD ["node", "src/index.js"]
