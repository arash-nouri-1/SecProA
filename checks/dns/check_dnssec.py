#! /usr/bin/env python3

import os
import sys
import requests
import urllib.request
from optparse import OptionParser
import socket

# define exit codes
ExitOK = 0
ExitWarning = 1
ExitCritical = 2
ExitUnknown = 3

def testdnssec(opts):
    domain = opts.domain
    domain = domain.replace("https://", "")
    domain = domain.replace("http://", "")
    domain = domain.replace("www.", "")
    if domain:
        try:
            socket.gethostbyname_ex(domain)
            num = True
        except:
            num = False           
        if not num:
            try:
                domain = ("www.%s"%domain)
                socket.gethostbyname_ex(domain)
            except:
                print('{"name": "DNSSEC", "score": 0, "message": "Unable to resolve %s"}'%domain)
                sys.exit(ExitUnknown)

        dig_requests = os.popen('dig @%s %s +noall +comments +dnssec'%(opts.dnsserver, domain)).read()
        if "ad;" in dig_requests:
            ad_flag = 1
        else:
            ad_flag = 0
        if "SERVFAIL," in dig_requests:
            status_error = 1
        else:
            status_error = 0
        if "NOERROR," in dig_requests:
            status_noerror = 1
        else:
            status_noerror = 0

        if ad_flag == 1 and status_noerror == 1:
            print('{"name": "DNSSEC", "score": 10/10, "message": "The domain %s is safe because it use a valid DNSSEC."}'%domain)
            sys.exit(ExitOK)
        elif status_error == 1:
            print('{"name": "DNSSEC", "score": 5/10, "message": "The domain %s uses DNSSEC, but this is invalid or misconfigured."}'%domain)
            sys.exit(ExitWarning)
        elif status_noerror == 1 and ad_flag == 0:
            print('{"name": "DNSSEC", "score": 0, "message": "Domain %s does not use DNSSEC"}'%domain)
            sys.exit(ExitCritical)
        else:
            print('{"name": "DNSSEC", "score": 0, "message": "Cannot read the result"}')
            sys.exit(ExitUnknown)
    else:
        print ('{"name": "DNSSEC", "score": 0, "message": "Impossible to check domains"}')
        sys.exit(ExitUnknown)
           
def main():
    parser = OptionParser()
    parser.add_option("-H","--domain", type=str,
                      dest="domain", help="Domain name for check DNSSEC, for example: -H www.ciencias.ulisboa.pt")
    parser.add_option("-d","--dnsserver", type=str, default="8.8.8.8", dest="dnsserver",
                      help="Specify the DNS server you need to use for check DNSSEC, for example: -d 127.0.0.1, default value is 8.8.8.8")

    (opts, args) = parser.parse_args()
    if not opts.domain:
        parser.error('{"name": "DNSSEC", "message": "Please, this program requires domain arguments, for example: -H www.ciencias.ulisboa.pt."}') 
        
    testdnssec(opts)

if __name__ == '__main__':
    main()
