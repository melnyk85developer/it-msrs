FROM node:22-alpine

WORKDIR /app

COPY client/package.json client/package-lock.json* ./client/
COPY client/packages ./client/packages
COPY client/services ./client/services

WORKDIR /app/client
RUN npm install

WORKDIR /app/client/services/host
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]