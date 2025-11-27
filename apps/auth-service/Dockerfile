# Build stage (optional for Node.js, but keeping simple)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Production image
FROM node:20-alpine AS production

WORKDIR /app

# Copy app from builder
COPY --from=builder /app ./

# Expose port
EXPOSE 8003

# Use NODE_ENV=production
ENV NODE_ENV=production

# Command to run the service
CMD ["node", "src/index.js"]
