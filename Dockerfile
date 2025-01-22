# Use the official Node.js image from the Docker Hub
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present) to install dependencies first
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 8000 for the application
EXPOSE 8000

# Command to run the application
CMD ["node", "metrics.js"]
