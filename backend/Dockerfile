FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate --schema=prisma/schema.prisma

RUN npm run build

RUN mkdir -p dist/generated && cp -r generated/prisma dist/generated/prisma

EXPOSE 3000

CMD ["npm", "run", "start:prod"]