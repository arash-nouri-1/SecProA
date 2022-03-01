#!/usr/bin/python3
import argparse
import dns.resolver
parser = argparse.ArgumentParser(description='Simple DMARC DKIM SPF quick test.')
parser.add_argument('domain', help='Domain name to test')
args = parser.parse_args()
domain = args.domain
score=0
result=""
#DMARC Test
try:
  test_dmarc = dns.resolver.resolve('_dmarc.' + domain , 'TXT')
  for dns_data in test_dmarc:
    if 'DMARC1' in str(dns_data):
      DMARCresult= dns_data
      mes="[PASS] DMARC record found."
      score+=3
except:
  mes="[FAIL] DMARC record not found."
  DMARCresult="Failed to find DMARC record."
  pass
# Testing DKIM
try:
  test_dkim = dns.resolver.resolve('._domainkey.' + domain , 'TXT')
  for dns_data in test_dkim:
    if 'DKIM1' in str(dns_data):
      DKIMCresult=dns_data
      mes1="[PASS] DKIM record found."
      score+=4    
except:
  mes1="[FAIL] DKIM record not found."
  DKIMCresult="Failed to find DKIM record."
  pass
# Testing SPF
try:
  test_spf = dns.resolver.resolve(domain , 'TXT')
  for dns_data in test_spf:
    if 'spf1' in str(dns_data):
      SPFresult=dns_data
      mes2="[PASS] SPF record found."  
      score+=3
except:
  mes2="[FAIL] SPF record not found."
  SPFresult="Failed to find SPF record."
  pass
result={"name":"Mailcheck","score":score,"message":[mes,mes1,mes2],"output":{"DMAR":DMARCresult,"DKIM":DKIMCresult,"SPF":SPFresult}}
  