FROM ghcr.io/puppeteer/puppeteer:23.11.1


WORKDIR /app

RUN chown node /app

USER node

COPY ./package.json .
COPY package-lock.json .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN npm ci;

COPY . /app

RUN npx esbuild --bundle --platform=node --outfile=dist/entry.js --packages=external backend/entry.ts

RUN ls -la dist .

COPY ./backend/entrypoint.sh /app/entry

ENTRYPOINT ["bash", "/app/entry"]


