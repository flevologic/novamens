<!DOCTYPE html>
<html>
	<head>
		<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
		<meta content="utf-8" http-equiv="encoding">
		<link href="https://fonts.googleapis.com/css?family=Droid+Sans" rel="stylesheet">
		<link rel="stylesheet" type="text/css" href="styles/main.css">
		<script type="text/javascript" src="scripts/jquery-3.1.1.min.js"></script>
		<script type="text/javascript" src="scripts/main.js"></script>

		<title>TraductApp</title>
	</head>
	<body>

		<div id="header">
			<div class="title">TraductApp</div>
			<div class="nav">
				<span id="navTranslate" onclick="toggleSection('translate');">Traducir</span>
				<span id="navLogs" onclick="toggleSection('logs');">Logs</span>
				<span id="navImportar" onclick="toggleSection('importar');">Importar Traducción</span>
			</div>
		</div>
		<div id="container">
			<div id="translate" class="section_visible">
				<form action="controller.php" method="post" id="traductappForm" enctype="multipart/form-data">
					<div class="directory_chooser">
						<span>Indique un directorio para analizar:</span>
		        		<!--<input type="file" name="files[]" id="files" multiple="" directory="" webkitdirectory="" mozdirectory=""> -->
						<input type="text" name="ruta" id="ruta"/>
					</div>
					<input class="boton" type="submit" name="submitButton" id="submitButton" value="Analizar" />
				</form>

				<div id="loading"></div>

				<div id="archivos">
				</div>
			</div>

			<div id="logs" class="section_hidden">
				<h2>No hay logs de traducciones.</h2>
			</div>

			<div id="importar" class="section_hidden">
				<h2>Importar Traducción</h2>
				<form action="controller.php" method="post" id="importForm" enctype="multipart/form-data">
					<div class="directory_chooser">
						<span>Seleccione un archivo para importar:</span>
		        		<input type="file" name="archivosImportar" id="archivosImportar" accept=".csv" required />
					</div>
					<input class="boton" type="submit" name="submitButton" id="submitButton" value="Importar" />
				</form>

				<div id="loading"></div>
			</div>
		</div>
		<?php
			if(isset($_GET["importar"])){
				if($_GET["importar"] == 1){
					echo '<script type="text/javascript">alert("Importación completa!");</script>';
				}
				else{
					echo '<script type="text/javascript">alert("Falló la importación del archivo!");</script>';
				}

				echo '<script type="text/javascript">toggleSection("importar");</script>';
			}
		?>
	</body>
</html>
