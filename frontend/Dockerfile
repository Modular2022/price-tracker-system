### STAGE 1: Build ###
FROM docker.io/node:18-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
### STAGE 2: Run ###
FROM docker.io/nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/price-tracker-ui /usr/share/nginx/html
### STAGE 3: Test ###
RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    net-tools \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
EXPOSE 80
