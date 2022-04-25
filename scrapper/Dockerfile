FROM python:3.8-slim-buster
RUN apt-get update \
&& apt-get install gcc -y \
&& apt-get clean
WORKDIR /app
COPY requirements.txt ./
RUN python -m pip install -r requirements.txt
COPY ./ ./
CMD ["walmart", "liverpool", "sams", "costco", "elektra", "homedepot"]
ENTRYPOINT ["python", "stores/sitemap.py"]