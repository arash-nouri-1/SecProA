#!/usr/bin/python

import sys
from modules.flow import Flow

def main(domain):
    flow = Flow()
    results = flow.run(domain)
    print(results)

if __name__ == "__main__":
    main(sys.argv[1])
