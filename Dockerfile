# global variable
ARG APP_ENV=""

# NODE_VERSION=16.16.0 PNPM_VERSION=7.5.2
FROM node:lts-alpine3.16 as build

RUN npm i -g pnpm pm2

ARG APP_ENV

WORKDIR /app

COPY .npmrc ./
RUN pnpm config set store-dir ./.pnpm-store
COPY pnpm-lock.yaml ./

RUN pnpm fetch

COPY . .

RUN pnpm install --offline --frozen-lockfile

RUN pnpm build

RUN npm pkg set scripts.prepare="echo 'remove husky'"

RUN pnpm install -r --offline --prod

# runner stage
FROM node:lts-alpine3.16 as runner

RUN npm i -g pnpm pm2
# https://stackoverflow.com/questions/53681522/share-variable-in-multi-stage-dockerfile-arg-before-from-not-substituted
ARG APP_ENV
WORKDIR /artifacts

COPY --from=build /app .

ENV APP_MODE="${APP_ENV}"

RUN echo "Will be started with mode: ${APP_MODE}"

EXPOSE 80

CMD pm2-runtime start ecosystem.config.js --env "${APP_MODE}"
