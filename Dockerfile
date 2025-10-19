# Dockerfile for Node.js CRUD API
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --only=production

# Bundle app source
COPY . .

# Expose API port
EXPOSE 3000

# Start the server
CMD ["node", "app.js"]
