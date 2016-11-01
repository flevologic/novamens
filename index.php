<!DOCTYPE html>
<link href="https://fonts.googleapis.com/css?family=Droid+Sans" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="styles/main.css">
<script type="text/javascript" src="scripts/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="scripts/main.js"></script>

<title>TraductApp</title>

<div id="header">
	<div class="title">TraductApp</div>
	<div class="nav">
		<span id="navTranslate" onclick="toggleSection('translate');">Traducir</span>
		<span id="navLogs" onclick="toggleSection('logs');">Logs</span>
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
		<h1>LISTADO DE LOGS</h1>
	</div>
</div>
