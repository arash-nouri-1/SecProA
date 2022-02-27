import os
import requests
import json

URL = os.environ.get("SEQUENCER_URL") + "/api/v1/"

def requestJob(name):
    req = requests.get(URL + f"job/{name}")

    if req.status_code == 404:
        return None
    elif req.status_code == 200:
        return json.loads(req.text)

def pushResults(results):
    req = requests.post(URL + "results", json=results)

    return req.status_code == 201
