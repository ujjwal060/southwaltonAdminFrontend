# Use an official Node.js runtime based on Debian/Ubuntu as the base image
FROM node:20-bullseye AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package.json ./

# Install dependencies with compatibility flags
RUN npm install --force --legacy-peer-deps

# Copy the entire application source code
COPY . .

# Build the React application for production
RUN npm run build

# Use the same Node.js image for serving the application
FROM node:20-bullseye AS production

# Set the working directory for the production container
WORKDIR /usr/src/app

# Install a lightweight HTTP server for serving static files
RUN npm install -g serve

# Copy the built application from the build stage
COPY --from=build /usr/src/app/build ./build

# Expose the desired port
EXPOSE 2023

# Command to serve the application
CMD ["serve", "-s", "build", "-l", "2023"]
