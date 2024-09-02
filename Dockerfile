FROM node:alpine

ENV DISCORD_TOKEN=SET_ME
ENV PORU_HOST=127.0.0.1
ENV PORU_NAME=local
ENV PORU_PASS=sendhelp
ENV PORU_PORT=2333
ENV NODE_ENV=production

RUN mkdir /bot
WORKDIR /bot

COPY package.json /bot
RUN npm install

COPY ./dist /bot

CMD ["node", "index.js"]