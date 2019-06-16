FROM node:12

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm install -g nodemon

RUN npm install