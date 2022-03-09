import os
import json
import requests

URL = os.environ.get("SEQUENCER_URL") + "/api/v1/"

def requestJob(name: str) -> dict | None:
    """Request a job from a sequencer server.

    Args:
        name (str): The checklist name.

    Returns:
        dict: The job request or None when no jobs are avalable.
    """
    req = requests.get(URL + f"job/{name}")

    if req.status_code == 200:
        return json.loads(req.text)

    return None

def pushResults(results: dict) -> bool:
    """Push flow results to a sequencer server.

    Args:
        results (dict): The dict to push to the server.

    Returns:
        bool: Has the push been successfull.
    """
    req = requests.post(URL + "results", json=results)

    return req.status_code == 201
