# FROM node:23.5.0-bookworm
FROM node:slim

# Install latest Chrome dev package and fonts to support major charsets
RUN apt-get update \
    && apt-get install -y chromium --no-install-recommends

# Run everything after as non-privileged user.
USER node

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

WORKDIR /app

COPY ./package.json .
COPY package-lock.json .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN npm ci;

# COPY . /app
#
# RUN npx esbuild --bundle --platform=node --outfile=dist/entry.js --packages=external backend/entry.ts
#
# RUN ls -la dist .
#
# COPY ./backend/entrypoint.sh /app/entry
#
#
# ENTRYPOINT ["bash", "/app/entry"]

COPY _billy/puppeteer.js puppeteer.js

COPY backend backend

ENV PUPPETEER_BIN=/bin/chromium

CMD ["puppeteer.js"]
