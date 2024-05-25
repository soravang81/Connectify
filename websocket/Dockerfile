FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]

FROM node:18-alpine

WORKDIR /app

COPY ./dist/index.js .

EXPOSE 8080 

CMD [ "node", "index.js" ]