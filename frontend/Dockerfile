FROM alpine:3.18

ENV NODE_VERSION 18.19.1

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]