FROM node:20-alpine

WORKDIR /usr/app

RUN npm install -g pnpm

COPY . .

RUN pnpm install
RUN rm -rf dist
RUN pnpm prisma generate
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]
