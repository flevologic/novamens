<?php

class ExportarArchivos{

	private $archivos = array();
	
	function __construct() {

	}

	function setArchivos($arch){
		$archivos = $arch;
	}

	function exportar(){
		//cabeceras para descarga
		header('Content-Type: application/octet-stream');
		header("Content-Transfer-Encoding: Binary"); 
		header("Content-disposition: attachment; filename=\"my_csv_file.csv\""); 
		 
		//preparar el wrapper de salida
		$outputBuffer = fopen("php://output", 'w');
		 
		//volcamos el contenido del array en formato csv
		foreach($column_array as $val) {
		    fputcsv($outputBuffer, $val);
		}
		//cerramos el wrapper
		fclose($outputBuffer);
		echo 2;
		exit;
	}

}

?>
