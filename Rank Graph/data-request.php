<?php 
function curl_response($url,$debug=false,$timeout=7)
{
    $api_call = curl_init();
    curl_setopt($api_call, CURLOPT_URL, $url);
    curl_setopt($api_call, CURLOPT_HEADER, 0);
    curl_setopt($api_call, CURLOPT_CONNECTTIMEOUT, $timeout);
    curl_setopt($api_call, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($api_call, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($api_call);
    $errno = curl_errno($api_call);
    if ($debug && (!is_string($response) || !strlen($response))) echo( "Failure Contacting Server. " );
    if($errno > 0 && $debug) echo 'Error Number:' . $errno;
    curl_close($api_call);
    return $response;
}

if(!isset($_GET['username'])) { $_GET['username'] = 'Smar'; }
if(!isset($_GET['gamecount'])) { $_GET['gamecount'] = 20; }

echo curl_response("http://beta.kaya.gs/gospeed/".$_GET['username']."/games.json?from=0&count=".$_GET['gamecount']);
die;
?>