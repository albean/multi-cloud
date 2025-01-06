FROM node:23.5.0-bookworm

USER node

WORKDIR /app

COPY ./package.json .
COPY package-lock.json .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN npm ci;

COPY . /app

RUN npx esbuild --bundle --platform=node --outfile=dist/entry.js --packages=external backend/entry.ts

RUN ls -la dist .

COPY ./backend/entrypoint.sh /app/entry


ENTRYPOINT ["bash", "/app/entry"]


