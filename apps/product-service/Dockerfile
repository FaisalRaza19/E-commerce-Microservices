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
EXPOSE 8000

# Set NODE_ENV
ENV NODE_ENV=production

# Start the service
CMD ["node", "src/index.js"]
