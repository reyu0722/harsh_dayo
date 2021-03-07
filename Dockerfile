FROM node:11.15.0-alpine

COPY ["package.json", "package-lock.json*", "./"]

RUN npm i -g npm && npm i

COPY . .