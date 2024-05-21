FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build step (assuming `npm run dev` handles the build)
CMD [ "npm", "run", "dev" ]

FROM node:18-alpine

WORKDIR /app

COPY ./dist/index.js .
# Copy the built output (index.js)

EXPOSE 8080 
# Expose the port where your WebSocket server listens

CMD [ "node", "index.js" ]  #