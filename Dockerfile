FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm prisma generate --schema=prisma/schema.prisma

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]
