FROM node:14.17.0

ENV NODE_ENV=development

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

EXPOSE 8080

CMD ["yarn", "start"]