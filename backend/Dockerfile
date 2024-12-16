FROM node:18.13.0-alpine AS development

WORKDIR /usr/src/app

COPY package.json ./

COPY package-lock.json ./

RUN npm install

COPY . .

RUN yarn build

CMD yarn start