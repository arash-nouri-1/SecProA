#! /usr/bin/env python3
import geoip2.database
import sys

def main(a):
    with geoip2.database.Reader('GeoLite2-City.mmdb') as reader:
        response = reader.city(a)
        country = response.country.iso_code
        eu_country = ["BE", "BG", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "HR", "IT", "CY",
                      "LV", "LT", "LU", "HU", "MT", "NL", "AT", "PL", "PT", "RO", "SI", "SK", "FI", "SE", "UK"]
        for i in eu_country:
            if i == country:
                print(f'{{"name": "geoIP", "score": 10, "message": "Uw website wordt gehost binnen de EU, meer bepaald in {country}"}}')
                sys.exit()
        print(f'{{"name": "geoIP", "score": 0, "message": "Uw website wordt niet gehost binnen de EU, meer bepaald in {country}, indien je persoonsgegevens verwerkt via je site kan dit problemen rond o.a. GDPR met zich meebrengen. Indien er geen persoonsgegevens verwerkt worden op je site, dan kan je deze score nuanceren."}}')
            
if __name__ == "__main__":
    a = sys.argv[1]
    main(a)
