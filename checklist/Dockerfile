FROM python:3.10-alpine

WORKDIR /app

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY ./modules/ ./modules/
COPY *.py ./

CMD [ "python", "/app/checklist.py"]
