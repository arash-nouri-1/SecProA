import os
import time
from modules.flow import Flow
from modules import jobs

TIMEOUT = 5

def main():
    """The main method.
    """
    flow = Flow()

    while True:
        try:
            job = jobs.requestJob(flow.getName())

            if job is None:
                time.sleep(TIMEOUT)
                continue

            results = flow.run(job['domain'])

            job['checks'] = results

            jobs.pushResults(job)
        except Exception:
            time.sleep(TIMEOUT)

if __name__ == "__main__":

    if os.environ.get("TIMEOUT") is not None:
        TIMEOUT = int(os.environ.get("TIMEOUT"))

    main()
