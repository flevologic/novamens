<?php
    ini_set("error_log", "/tmp/php-error.log");
$ruta = "";
include 'config.php';
include 'Traductor.php';
include 'AccessTokenAuthentication.php';
include 'HTTPTranslator.php';
include 'MicrosoftApiTranslator.php';

if (isset($_POST["ruta"])) {
	$ruta = $_POST["ruta"];
	$archivos = array();
	listar($ruta, $archivos);
	echo json_encode($archivos);
}
else if (isset($_POST["archivos"])) {
	$fromLanguage = $_POST["origen"];
	$toLanguage   = $_POST["destino"];

	$archivos = json_decode($_POST["archivos"]);

	if ($apiToUse == "MicrosoftApiTranslator") {
		$traductApi = new MicrosoftApiTranslator($clientID, $clientSecret, $authUrl, $scopeUrl, $grantType);
	}

	$traductApi->getToken();

	$jsonToTraductOnArray = array();

	for($i = 0; $i < count($archivos); $i++ ){
		$nombre = $archivos[$i]->nombre;
		$ruta = $archivos[$i]->ruta;
		$idioma = $archivos[$i]->idioma;

		$jsonToTraductOnArray[] = $ruta . "/" . $nombre;
	}

	$traductApi->traduct($jsonToTraductOnArray, $fromLanguage, $toLanguage);
}   

function listar($path, &$archivos){
	$dir = opendir($path);
	$files = array();
	while ($current = readdir($dir)){
		if( $current != "." && $current != "..") {
		    	if(is_dir($path.$current)) {
				listar($path.$current.'/', $archivos);
		    	}
		    	else {
				if(preg_match("/.*\.properties/", $path.$current))
			  		$files[] = $current;
		    	}
		}
	}
	if(count($files) > 0)
		$archivos[$path] = $files;
	}

