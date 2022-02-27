import os
import time
from modules.flow import Flow
import modules.jobs as jobs

TIMEOUT = 5

def main():
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
        except:
            time.sleep(TIMEOUT)

if __name__ == "__main__":

    if os.environ.get("TIMEOUT") is not None:
        TIMEOUT = int(os.environ.get("TIMEOUT"))

    main()
