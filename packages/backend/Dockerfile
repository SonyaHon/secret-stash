FROM node:16-alpine
WORKDIR /app/backend

RUN apk add git ffmpeg

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build
