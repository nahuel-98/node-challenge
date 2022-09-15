FROM node:16.14.2-alpine3.15

WORKDIR /usr/app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build:database
