### STAGE 1: Build ###
FROM docker.io/node:18-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
RUN npm install --global http-server
COPY . .
RUN npm run build

CMD [ "http-server", "/usr/src/app/dist/price-tracker-ui"]
