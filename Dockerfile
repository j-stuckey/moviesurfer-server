FROM node:11

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm install -g nodemon

RUN npm install