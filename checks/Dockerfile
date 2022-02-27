FROM checklist:latest

ARG checklist

WORKDIR /app/checks

COPY ./$checklist/requirements.txt .
RUN pip install -r requirements.txt

COPY ./$checklist/ .
