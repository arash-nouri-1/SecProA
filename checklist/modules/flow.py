import yaml
import json

from subprocess import Popen
from subprocess import PIPE

class Flow:
    def __init__(self):
        self.load()

    def load(self):
        with open("flow.yml", "r") as stream:
            self.flow = yaml.safe_load(stream)

    def getName(self):
        return self.flow['name']

    def run(self, domain):
        stages = len(self.flow['stages'])

        results = []
        env = {}

        print(f"Starting flow {self.flow['name']} with {stages} stages.")

        for i in range(stages):
            stage = self.flow['stages'][i]

            print(f"Executing stage {i + 1}/{stages}: {stage['name']}")

            if stage['checks'] is None or len(stage['checks']) == 0:
                continue

            checks = []

            for check in stage['checks']:
                checks.append(Popen(["./" + check, domain], stdout=PIPE, encoding="utf-8", env=env))

            for check in checks:
                output, err = check.communicate()

                result = json.loads(output)

                if "score" in result:
                    results.append(result)

                if "output" in result:
                    for key in result['output']:
                        env[key] = result['output'][key]

        return results
