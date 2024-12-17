# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Production Image
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
