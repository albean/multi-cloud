FROM python:3.8

COPY requirements.txt /var/app/requirements.txt

WORKDIR /var/app

RUN pip install --no-cache-dir -r requirements.txt

COPY . /var/app

CMD ["flask", "--app", "server", "run", "--port=80", "--host=0.0.0.0"]

