FROM node:22

WORKDIR /app

COPY server/package.json ./
COPY server/yarn.lock ./

RUN corepack enable
RUN yarn install

COPY server .

EXPOSE 5006

CMD ["yarn", "start:dev"]