FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma

ARG DATABASE_URL
RUN DATABASE_URL=${DATABASE_URL} npx prisma generate --schema=prisma/schema.prisma

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]