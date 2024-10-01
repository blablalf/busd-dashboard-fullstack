FROM node:20-alpine

WORKDIR /usr/app/back

# RUN apk add --no-cache postgresql-client # For testing
RUN npm install -g pnpm

# RUN rm -rf dist
# RUN rm -rf node_modules
# RUN pnpm install
# RUN pnpm prisma generate
# RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]
