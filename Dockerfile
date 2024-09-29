FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm prisma generate
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]
