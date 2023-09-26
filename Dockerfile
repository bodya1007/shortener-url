FROM node:16 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci
COPY . .
RUN npm install -g node-inspect jest nodemon
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
