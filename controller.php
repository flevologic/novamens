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

		$jsonToTraductOnArray[] = $ruta . "/" . $nombre;

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
	$fecha = new DateTime();
	$date = $fecha->getTimestamp();
	$finalFile = "exportacion_" . $date . ".csv";
	$f = fopen($finalFile,"w");
	$sep = ";"; //separador

	fwrite($f,"nombre;ruta;".PHP_EOL);
	foreach($archivos as $reg ) {
		//obtengo la traduccion de cada archivo
		$arch = fopen($reg->ruta.$reg->nombre,"r");
		fwrite($f,$reg->nombre . $sep . $reg->ruta . $sep.PHP_EOL);
		$traduccionActual="";
		$aArchivo = array();
		fwrite($f,"etiqueta;antes;actual;modificado".PHP_EOL);
		while (!feof($arch)) {
			//$traduccionActual .= trim(fgets($arch));
			$contEtiquetas = trim(fgets($arch));
			if($contEtiquetas != ""){
				//Separo Key Values
				$lineValue = explode("=",$contEtiquetas);
				//Contemplo si hay '=' en el value
				if (sizeof($lineValue) > 2) {
					//Uno los value
					for($i = 2; $i < sizeof($lineValue); $i++) {
						$lineValue[1] .= "=".$lineValue[$i];
					}
				}
				$aArchivo[$lineValue[0]]["antes"] = $lineValue[1];
			}
		}
		//Cierro el archivo leido
		fclose($arch);

		//Abro el archivo traducido
		$idiomaDestino = $_POST["idiomaDestino"];
		//Armo el nombre del archivo
		$nombreArch = "";
		$aNombreArch = explode(".",$reg->nombre);
		$nombreSufijoArch = $idiomaDestino . ".properties";

		for($i=0;$i < count($aNombreArch)-1;$i++){
			$nombreArch .= $aNombreArch[$i];
		}

		$nombreArch .= "_" . $nombreSufijoArch;
		$archTraducido = fopen($reg->ruta.$nombreArch,"r");

		while (!feof($archTraducido)) {
			//$traduccionActual .= trim(fgets($arch));
			$contEtiquetas = trim(fgets($archTraducido));
			if($contEtiquetas != "") {
				//Separo Key Values
				$lineValue = explode("=",$contEtiquetas);
				//Contemplo si hay '=' en el value
				if (sizeof($lineValue) > 2) {
					//Uno los value
					for($i = 2; $i < sizeof($lineValue); $i++) {
						$lineValue[1] .= "=".$lineValue[$i];
					}
				}

				$aArchivo[$lineValue[0]]["actual"] = $lineValue[1];
			}
		}
		//Cierro el archivo leido
		fclose($archTraducido);

		foreach($aArchivo as $clave => $valor) {
			$linea = $clave . $sep . $valor["antes"] . $sep . $valor["actual"] . $sep . "" . PHP_EOL;
			fwrite($f,$linea);
		}
	}
	echo $finalFile;
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
