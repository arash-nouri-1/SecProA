#!/usr/bin/perl 
# qbl - gebruikt een externe nagios plugin om verschillende blacklists te checken
# Dependencies : 
# -> https://github.com/egeland/nagios-rbl-check/blob/master/check_rbl.py 
# version 0.2 - Jan Guldentops ( j@ba.be ) - 16 juni 2019


$testurl = $ARGV[0];
$baser = "results";

# check if empty 
if($testurl eq ""){ 
	print '{"name": "Blacklist2", "message": "Please provide an hostname to check!"}' ; 
	exit	
  }

#date 
$date =`date +%d%m%Y-%H:%M:%S`;
chop($date);


#firstcheck 
open(IN, "./check_rbl.py -w 1 -c 100 -h $testurl |");
while(<IN>){
	chop;
if(/WARNING/)
{	($state,$tosplit,$bls) = split(/:/);
	@brol = split(/ /,$tosplit);
	$numberbl = $brol[3];
	$numberbl = $numberbl - 1 + 1;
}
}
#print "$testurl;$date;qbl;$state;$numberbl;$bls\n";
system("echo \"$testurl|$date|qbl|$state|$numberbl|$bls\" >> $baser/check.log");

if($numberbl == 0){
	$score = 10 ; 
	$reason  = "Webserver komt voor in volgende blacklists : $bls";
}
if($numberbl > 10){
	$score = 0 ; 
	$reason  = "Webserver komt voor in volgende blacklists : $bls";
}
if($numberbl < 10){
	$score = 10 - $numberbl; 
	$reason  = "Webserver komt voor in volgende blacklists : $bls";
}
$name = '"name": "Blacklist2",';
$message = '"message":';	
$punten = '"score":';
print "{$name $punten $score, $message '$date|$reason'}";
system("echo \"$testurl|$date|qbl|$score|$reason\"  >> $baser/score.log");
