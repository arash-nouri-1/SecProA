#!/usr/bin/perl 
# qgeoip
# version 0.2 - Jan Guldentops ( j@ba.be ) - 16 juni 2019
#

$testurl = $ARGV[0];
$option = $ARGV[1];
$baser = "results";
$check = "NOK";
$name = '"name": "geoIP",';
$message = '"message":';	
$punten = '"score":';
# check if empty
if($testurl eq ""){
        print '{"name": "geoIP", "message": "Please provide an hostname to check!"}' ;
        exit
  }

#getip
open(IN, "host -W 5 $testurl |");
while(<IN>){
	if(/ has address /) {
		($brol,$hostip) = split(/ has address /);
}
}

#date 
$date =`date +%d%m%Y-%H:%M:%S`;
chop($date);
#firstcheck 
if($hostip eq ""){ 
$score = "0";
$reason = "Kan de hostname niet via dns opzoeken, geen GEOIP";
print "{$name $message '$date|$reason'}";;


exit 
}

#checkone
open(IN, "./geoipcli-go-linux-amd64 -country GeoLite2-Country.mmdb $hostip |");
while(<IN>){
	chop; 
	($ip,$country) = split (/,/);
	@eu = ("BE","BG","CZ","DK","DE","EE","IE","EL","ES","FR","HR","IT","CY","LV","LT","LU","HU","MT","NL","AT","PL","PT","RO","SI","SK","FI","SE","UK");
	$i = 0; 
	while($i < 28){
		if($country eq $eu[$i]){
			$check = "EU";
		}
						$i = $i + 1;

	}
}

#checktwo 
open(IN, "whois $hostip |");
while(<IN>){
	chop;
	if(/country:/i){
		@brol = split(/:        /);
		$whoiscountry="$whoiscountry$brol[1]-";
}
}
chop($whoiscountry);
if($check eq "EU"){
	$score = 10 ; 
	$reason = "Uw website wordt gehost binnen de EU, meer bepaald in $country ( of $country volgens de whois informatie)";
}
else{
	$score = 0 ; 
	$reason = "Uw website wordt niet gehost binnen de EU, meer bepaald in $country ( of $country volgens de whois informatie) dit kan, indien je persoonsgegevens verwerkt via je site, probelemn rond o.a. GDPR met zich meebrengen. Indien er geen persoonsgegevens verwerkt worden op je site, dan kan je deze score nuanceren."
}
#print "$testurl;$date;qgeoip;$ip;$country;$whoiscountry\n";
if($option ne "-t"){
print "{$name $punten $score, $message '$date|$reason'}";
system("echo \"$testurl|$date|qgeoip|$country|$whoiscountry\" >> $baser/check.log");
}

else{
print "{$name $message '$country-$whoiscountry'";
}
