# Use a minimal base image
FROM node:18-alpine

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first (to leverage Docker cache for npm install)
COPY package*.json ./

# Fix permissions for the copied files (if needed)
RUN chmod 755 /app/package*.json

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
