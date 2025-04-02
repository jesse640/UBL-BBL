# Use official Node.js image
FROM node:18

# Install system dependencies (including Java for xsd-schema-validator)
RUN apt-get update && apt-get install -y libxml2 openjdk-17-jdk

# Set JAVA_HOME
ENV JAVA_HOME /usr/lib/jvm/java-17-openjdk-amd64
ENV PATH $JAVA_HOME/bin:$PATH

# Set working directory inside /api
WORKDIR /app/api

# Copy package.json and install dependencies
COPY api/package.json api/package-lock.json ./
RUN npm install --production

# Copy rest of the app
COPY api . 

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
