FROM node:23.5.0-bookworm

COPY requirements.txt /var/app/requirements.txt


RUN mkdir /app
WORKDIR /app

COPY ./package.json .
COPY package-lock.json .

RUN npm ci;

COPY . /var/app

CMD ["flask", "--app", "server", "run", "--port=8079", "--host=0.0.0.0"]


