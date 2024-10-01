FROM node:20-alpine

WORKDIR /usr/app/front

# RUN apk add --no-cache postgresql-client # For testing
RUN npm install -g pnpm

EXPOSE 5173

CMD ["pnpm", "run", "dev"]
