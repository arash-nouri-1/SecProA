import json
import sys
import math

def main():
    # Parse provided spec into a dict
    spec = json.loads(sys.stdin.read())
    evaluate(spec)

def evaluate(spec):
    try:
        value = int(spec["metrics"][0]["value"])
        throughput = int(spec["resource"]["metadata"]["labels"]["throughput"])

        # Calculate replicas
        replicas = math.ceil(value / throughput)

        # Build JSON dict with targetReplicas
        evaluation = {}
        evaluation["targetReplicas"] = replicas

        # Output JSON to stdout
        sys.stdout.write(json.dumps(evaluation))

    except ValueError as err:
        # If not an integer, output error
        sys.stderr.write(f"Invalid metric value: {err}")
        exit(1)

if __name__ == "__main__":
    main()
