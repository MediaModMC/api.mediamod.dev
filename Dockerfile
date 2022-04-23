FROM node:lts-slim as builder

RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && apt-get autoremove -y && apt-get install libssl-dev -y

RUN groupadd -r nodejs && useradd -g nodejs -s /bin/bash -d /home/nodejs -m nodejs
USER nodejs
RUN mkdir -p /home/nodejs/app/node_modules && chown -R nodejs:nodejs /home/nodejs/app

WORKDIR /home/nodejs/app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ENV NPM_CONFIG_LOGLEVEL=warn

COPY . ./
RUN yarn
RUN yarn prisma generate
RUN yarn build

COPY --chown=nodejs:nodejs . .

EXPOSE 3000

CMD [ "node", "." ]