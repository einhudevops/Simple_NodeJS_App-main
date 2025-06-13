# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source code
COPY . .

# Expose the app port
EXPOSE 3000

# Start the app
CMD [ "node", "app.js" ]