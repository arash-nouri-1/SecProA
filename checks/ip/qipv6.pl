#!/usr/bin/perl 
# qipv6 - check gewoon of de website een ipv6 adres heeft 
# version 0.2 - Jan Guldentops ( j@ba.be ) - 9 juli 2019
# Dependencies : 
# binutils

$testurl = $ARGV[0];
$baser = "results";

# check if empty 
if($testurl eq ""){ 
	print '{"name": "IPV6", "message": "Please provide an hostname to check!"}' ; 
	exit	
  }

#date 
$date =`date +%d%m%Y-%H:%M:%S`;
chop($date);

$score = 0;
#firstcheck 
open(IN, "host $testurl |");
while(<IN>){
	chop;
	if(/IPv6/){
		$score=10;
		$detail=$_;	
	}
}
$name = '"name": "DNSSEC2",';
$message = '"message":';	
$punten = '"score":';

if($score == 0) { $reason="Uw website heeft geen ipv6 adress" };
if($score == 10){ $reason="Uw website heeft een ipv6 adress ( $detail) en is klaar voor de toekomst" };
print "{$name $punten $score, $message '$date|$reason'}";
#system("echo \"$testurl|$date|qbl|$state|$numberbl|$bls\" >> $baser/check.log");

