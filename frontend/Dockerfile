FROM node as build

RUN mkdir /app;
COPY package.json /app
COPY package-lock.json /app

WORKDIR /app

RUN npm ci;

COPY frontend /app/frontend
COPY vite.config.ts /app
COPY tailwind.config.js /app
COPY postcss.config.js /app

RUN ls -la

ARG BACKEND_PREFIX="https://app-backend-server-1087863064045.europe-west1.run.app/"
ENV BACKEND_PREFIX=$BACKEND_PREFIX

RUN npx vite build;

RUN ls -la frontend/dist;
RUN ls -la frontend/dist;

FROM nginx

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/frontend/dist /usr/share/nginx/html
