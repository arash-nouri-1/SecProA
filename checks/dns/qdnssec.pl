#!/usr/bin/perl 
# qdnssec - checkt of een domein dnssec heeft 
# Dependencies : 
# https://exchange.nagios.org/directory/Plugins/Security/check_dnssecurity/details
# version 0.2 - Jan Guldentops ( j@ba.be ) - augustus 2019
#

$testurl = $ARGV[0];
$baser = "results";

# check if empty 
if($testurl eq ""){ 
	print '{"name": "DNSSEC2", "message": "Please provide an hostname to check!"}' ; 
	exit	
  }

#date 
$date =`date +%d%m%Y-%H:%M:%S`;
chop($date);


#firstcheck 
open(IN, "./check_dnssec.py -H $testurl |");
while(<IN>){
	chop;
	if(/The domain/) { 
		$score = 10 ; 
		$reason = "Het domein van $testurl gebruikt DNSSEC ($_)";
	}
	if(/does not use DNSSEC/){
		$score = 0; 
		$reason = "Het domein van $testurl gebruikt geen DNSSEC";
	}
}
$name = '"name": "DNSSEC2",';
$message = '"message":';	
$punten = '"score":';
print "{$name $punten $score, $message '$date|$reason'}";
system("echo \"$testurl|$date|qdnssec|$score|$reason\"  >> $baser/score.log");

