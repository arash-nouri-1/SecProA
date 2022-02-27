#!/usr/bin/perl
# 
# Scan to see if the websites have http->https redirection 
# 
# version 0.2  10 october 2017 - Jan Guldentops ( j@ba.be )
# 
# Dependencies: 
# curl
$timeout =30;
$testurl = $ARGV[0];
$baser = "results";
$status = "OK" ;

if($testurl eq ""){ 
        print '{"name": "HTTP/HTTPS", "message": "Please provide an hostname to check!"}' ; 
        exit    
  }

#date 
$date =`date +%d%m%Y-%H:%M:%S`;
chop($date);
open(CURL, "curl --connect-timeout $timeout -S -A \"BA websurvey\" -I http://$testurl 2>&1 |");
while(<CURL>){
		chop; chop;
		if($_ =~ /Connection timed out/){
			$status="NOK";
			$redir = "Connection timed out";
		}
		if($_ =~ /HTTP/){
			$redir= "$_";
			($http,$code,$fullcode) = split(/ /);
		}
		if($_ =~ /Location/){
                        $location = "$_";
                }
		if($_ =~ /Server:/){
                        $server = "$_";
                }
		if($_ =~ /X-Powered-By/){
                        $poweredby = "$_";
                }
	}
	#print "$testurl | $status | $redir | $location | $server | $poweredby\n";

if($status eq "NOK"){
	$score = 5 ; 
	$reason = "We kunnen geen http-connectie leggen met uw website maar er is ook geen redirectie naar https://. Misschien kan u best een redirectie opzetten?"
	}
if($code eq "200"){ $score = 0; $reason = "Uw website is bereikbaar via het onbeveiligde http, dit betekent dat in bepaalde gevallen bezoekers onversleuteld gegevens naar uw website kunnen doorsturen. Misschien kan u een redirectie naar https opzetten?"; }
if($code eq "302") { $score = 10; $reason = "Alle potentieel onveilige verkeer via http naar uw website, wordt doorgestuurd naar het veilige $location." }
if($code eq "301") { $score = 10; $reason = "Alle potentieel onveilige verkeer via http naar uw website, wordt doorgestuurd naar het veilige $location." }
$name = '"name": "DNSSEC2",';
$message = '"message":';	
$punten = '"score":';
print "{$name $punten $score, $message '$date|$reason'}";
system("echo \"$testurl|$date|qredir|$grade|$redir|$location|$server|$poweredby\" >> $baser/check.log");


