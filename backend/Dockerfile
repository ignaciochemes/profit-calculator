FROM node:20.14.0-buster-slim

WORKDIR /app
COPY package.json package-lock.json /app/
COPY src /app/src
COPY .env /app/
COPY docker-entrypoint.sh tsconfig.json tsconfig.build.json /app/
COPY ormconfig.ts nest-cli.json /app/

RUN chmod +x /app/docker-entrypoint.sh
RUN npm install
RUN npm run prebuild
RUN npm run build

ENTRYPOINT ["/app/docker-entrypoint.sh", "${APP}"]