FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build
RUN cp -r src/generated dist/src/generated
EXPOSE 3000
CMD ["npm", "run", "start:prod"]