ARG registry
FROM $registry/checklist:latest

ARG checklist

WORKDIR /app/checks

RUN echo "$registry"

COPY ./$checklist/requirements.txt .
RUN pip install -r requirements.txt

COPY ./$checklist/ .
