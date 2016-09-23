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
		<form action="controller.php" method="post" id="traductappForm">
			<div class="directory_chooser">
				<span>Seleccione un directorio para analizar:</span>
				<input type="file" name="directory" webkitdirectory directory multiple />
			</div>
			<input type="submit" name="submitButton" value="Analizar" />
		</form>
	</div>

	<div id="logs" class="section_hidden">
		<h1>LISTADO DE LOGS</h1>
	</div>
</div>