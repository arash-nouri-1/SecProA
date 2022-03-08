#!/usr/bin/python3
import argparse
import dns.resolver
import json

parser = argparse.ArgumentParser(description='Simple DKIM quick test.')
parser.add_argument('domain', help='Domain name to test')
args = parser.parse_args()
domain = args.domain
listselectors=["selector1","selector2","google","everlytickey1","everlytickey2","eversrv","k1","mxvault","dkim"]
for selector in listselectors:
 try:
    test_dkims = dns.resolver.resolve(selector+'._domainkey.' + domain , 'TXT')
    break
 except:
    pass
def DKIMtest():
  try:
     test_dkim = test_dkims
     for dns_data in test_dkim:
       if 'DKIM1' in str(dns_data):
         mes="[PASS] DKIM record found."
         score=10
         result={"name":"DKIM check","score":score,"message":mes}
         return result
  except:
    mes="[FAIL] DKIM record not found."
    score=-1
    result={"name":"DKIM check","score":score,"message":mes}
    return result
result=DKIMtest()
jsonresult=json.dumps(result)
print(jsonresult)
