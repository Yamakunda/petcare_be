FROM node:20.12.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN apk add --no-cache make gcc g++ python3 && \
    npm rebuild bcrypt --build-from-source && \
    apk del make gcc g++ python3
COPY . .

EXPOSE 8080

CMD ["node", "index.js"]



