#!/usr/bin/python3
import argparse
import json
import dns.resolver

parser = argparse.ArgumentParser(description='Simple DMARC quick test.')
parser.add_argument('domain', help='Domain name to test')
args = parser.parse_args()
domain = args.domain
def DMARCtest(domain):
  print("start DMARC test")
  try:
    test_dmarc = dns.resolver.resolve('_dmarc.' + domain , 'TXT')
    for dns_data in test_dmarc:
      if 'DMARC1' in str(dns_data):
        mes="[PASS] DMARC record found."
        score=10
        result={"name":"DMARC check","score":score,"message":mes}
        return result
  except:
   mes="[FAIL] DMARC record not found."
   score=0
   result={"name":"DMARC check","score":score,"message":mes}
   return result
result=DMARCtest(domain)
jsonresult=json.dumps(result)
print(jsonresult)