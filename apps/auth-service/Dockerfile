# Base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/auth-service/package.json ./apps/auth-service/
COPY packages ./packages

# Install pnpm
RUN npm install -g pnpm

# Development stage
FROM base AS development

# Install all dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3002

# Start development server
CMD ["pnpm", "--filter", "auth-service", "run", "dev"]

# Production stage
FROM base AS production

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy source code and build
COPY . .
RUN pnpm --filter auth-service run build

# Expose port
EXPOSE 3002

# Start production server
CMD ["pnpm", "--filter", "auth-service", "run", "start:prod"]