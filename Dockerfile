FROM node:18-alpine

ENV PORT=8123

WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8123

CMD [ "npm", "start" ]