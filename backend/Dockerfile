FROM node:23.5.0-bookworm

RUN mkdir /app
WORKDIR /app

COPY ./package.json .
COPY package-lock.json .

RUN npm ci;

COPY . /app

RUN ls -la

COPY ./backend/entrypoint.sh /var/app/entry

RUN chmod +x /var/app/entry

ENTRYPOINT /var/app/entry


