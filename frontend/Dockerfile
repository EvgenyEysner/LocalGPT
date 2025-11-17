# Dockerfile.dev
FROM node:24-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 5173

CMD ["yarn", "dev", "--host"]