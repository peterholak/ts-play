FROM node:10-alpine AS build

RUN apk add --no-cache git dumb-init && npm install -g gulp && mkdir -p /code/dist

COPY . /code
RUN \
    cd /code/frontend && \
    npm install && \
    ./setup-monaco.sh && \
    ./node_modules/.bin/webpack -p && \
    cp -r dist ../dist/frontend

RUN \
    cd /code/server && \
    npm install && \
    npm run build && \
    npm run test

FROM node:10-alpine AS main

COPY --from=build /code/dist /tsplay
COPY --from=build /usr/bin/dumb-init /dumb-init
WORKDIR /tsplay
ENTRYPOINT ["/dumb-init", "node", "server/src/server"]
