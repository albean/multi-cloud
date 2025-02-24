FROM node:23.5.0-bookworm

# Install latest Chrome dev package and fonts to support major charsets
RUN apt-get update \
  && apt-get install -y chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends


RUN mkdir /app && chown node /app;

RUN mkdir -p /var/attachments && chown node:node /var/attachments;

# Run everything after as non-privileged user.
USER node

WORKDIR /app

COPY ./package.json .
COPY package-lock.json .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

RUN npm ci;

COPY . /app

RUN npx esbuild --bundle --platform=node --outfile=dist/entry.js --packages=external backend/entry.ts

RUN ls -la dist .

COPY ./backend/entrypoint.sh /app/entry

VOLUME ["/var/attachments"]

ENTRYPOINT ["bash", "/app/entry"]
