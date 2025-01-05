FROM node:23.5.0-bookworm

RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libgbm1 \
  libnspr4 \
  libnss3 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /app

COPY ./package.json .
COPY package-lock.json .

RUN npm ci;

COPY . /app

RUN npx esbuild --bundle --platform=node --outfile=dist/entry.js --packages=external backend/entry.ts

RUN ls -la dist .

COPY ./backend/entrypoint.sh /var/app/entry

RUN chmod +x /var/app/entry

ENTRYPOINT /var/app/entry


