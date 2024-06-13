# Use the official Node.js 18.18.0 image
FROM node:18.18.0 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 5000

# Command to run the backend server
CMD [ "node", "app.js" ]