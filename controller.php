<?php
ini_set("error_log", "/tmp/php-error.log");
date_default_timezone_set('America/Buenos_Aires');
$ruta = "";
include 'config.php';
include 'Traductor.php';
include 'filestoignore.php';
include 'AccessTokenAuthentication.php';
include 'HTTPTranslator.php';
include 'MicrosoftApiTranslator.php';
include 'ExportarArchivos.php';


if (isset($_POST["ruta"])) {
	$ruta = $_POST["ruta"];
	$archivos = array();
	listar($ruta, $archivos, $filesToIgnore);
	echo json_encode($archivos);
}
else if (isset($_POST["archivos"])) {
	$logFile = @fopen('log.csv', 'a');
	if ($logFile) {
		fwrite($logFile, date("d-m-Y H:i:s") . ',');
	}

	$fromLanguage = $_POST["origen"];
	if ($logFile) {
		fwrite($logFile, $fromLanguage . ',');
	}
	$toLanguage   = $_POST["destino"];
	if ($logFile) {
		fwrite($logFile, $toLanguage . ',');
	}

	$archivos = json_decode($_POST["archivos"]);

	if ($apiToUse == "MicrosoftApiTranslator") {
		$traductApi = new MicrosoftApiTranslator($clientID, $clientSecret, $authUrl, $scopeUrl, $grantType);
	}

	$traductApi->getToken();

	$jsonToTraductOnArray = array();
	$archivosTraducidos = '';
	for($i = 0; $i < count($archivos); $i++ ){
		$nombre = $archivos[$i]->nombre;
		$ruta = $archivos[$i]->ruta;
		$idioma = $archivos[$i]->idioma;

		$jsonToTraductOnArray[] = $ruta . $nombre;

		if ($archivosTraducidos != '') {
			$archivosTraducidos .= ' - ';
		}
		$archivosTraducidos .=  $ruta . $nombre;
	}
	if ($logFile) {
		fwrite($logFile, $archivosTraducidos.',');
	}
	$traductResult = $traductApi->traduct($jsonToTraductOnArray, $fromLanguage, $toLanguage);

	if ($logFile) {
		fwrite($logFile, date("d-m-Y H:i:s"));
		fwrite($logFile, PHP_EOL);
		fclose($logFile);
	}
	echo $traductResult;
}
else if (isset($_POST["individualFile"])) {
	if ($apiToUse == "MicrosoftApiTranslator") {
		$traductApi = new MicrosoftApiTranslator($clientID, $clientSecret, $authUrl, $scopeUrl, $grantType);
	}

	echo $traductApi->saveIndividualFile($_POST["individualFile"], $_POST["val"]);
}
else if (isset($_POST["logs"])) {
	$logFile = fopen('log.csv', 'r');
	if ($logFile !== false) {
		while (!feof($logFile)) {
			$lineValue = fgets($logFile);
			$log[] = explode(",", $lineValue);
		}
	}
	fclose($logFile);
	echo json_encode(array_reverse($log));
}
else if (isset($_POST["archivosExportar"])){
	$archivos = json_decode($_POST["archivosExportar"]);

	$f = fopen("exportar.csv","w");
	$sep = ";"; //separador
	fwrite($f,"nombre;ruta;actual;modificacion".PHP_EOL);
	foreach($archivos as $reg ) {
		//obtengo la traduccion de cada archivo
		$arch = fopen($reg->ruta.$reg->nombre,"r");
		$traduccionActual="";
		while (!feof($arch)) {
			$traduccionActual .= trim(fgets($arch));

		}
		var_dump($traduccionActual);
		//Cierro el archivo leido
		fclose($arch);

	 	$linea = $reg->nombre . $sep . $reg->ruta . $sep . $traduccionActual . $sep . "" . PHP_EOL;
		fwrite($f,$linea);

	}
	fclose($f);

}

function listar($path, &$archivos, $filesToIgnore) {
	$dir = @opendir($path);
	if ($dir) {
		$files = array();
		while ($current = readdir($dir)){
			if ($current != "." && $current != "..") {
				if(is_dir($path.$current)) {
					listar($path.$current.'/', $archivos, $filesToIgnore);
				}
	    else {
				if(preg_match("/.*\.properties/", $path.$current))
					// echo str_replace('.properties', '', $current);
					if (!in_array(str_replace('.properties', '', $current), $filesToIgnore)){
						$files[] = $current;
					}
			  }
			}
		}
		if(count($files) > 0) {
			$archivos[$path] = $files;
		}
	}
}