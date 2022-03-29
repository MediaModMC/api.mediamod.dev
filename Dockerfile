FROM node:lts-slim as builder

RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && apt-get autoremove -y

RUN groupadd -r nodejs && useradd -g nodejs -s /bin/bash -d /home/nodejs -m nodejs
USER nodejs
RUN mkdir -p /home/nodejs/app/node_modules && chown -R nodejs:nodejs /home/nodejs/app

WORKDIR /home/nodejs/app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ENV NPM_CONFIG_LOGLEVEL=warn

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY --chown=nodejs:nodejs . .

EXPOSE 8080

CMD [ "node", "./dist/index.js" ]