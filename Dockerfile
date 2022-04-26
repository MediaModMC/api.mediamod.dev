FROM node:lts-slim as builder
RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && apt-get autoremove -y && apt-get install libssl-dev -y

RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app
USER node

WORKDIR /usr/src/app
COPY --chown=node:node . ./

RUN yarn && yarn build
EXPOSE 3000
CMD [ "yarn", "start" ]