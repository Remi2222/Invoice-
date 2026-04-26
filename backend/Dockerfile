FROM node:22-alpine

RUN apk add --no-cache chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build
RUN cp -r src/generated dist/src/generated
EXPOSE 3000
CMD ["npm", "run", "start:prod"]