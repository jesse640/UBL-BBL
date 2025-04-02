# Use official Node.js image
FROM node:18

# Install system dependencies
RUN apt-get update && apt-get install -y libxml2

# Set working directory
WORKDIR /api

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy rest of the app
COPY . .

# Expose port (change if needed)
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
