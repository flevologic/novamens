$(document).ready(function() {
	toggleSection();
	archivos = "";
	idiomas = [];
	codigosIdiomas = [];
	archivosSeleccionados = [];
	$("#traductappForm").submit(function(e){
		$('#archivos').hide();
		toggleLoading();
		e.preventDefault();
		var ruta = $("#ruta").val();
		$.ajax({
        	url: 'controller.php',
        	method: "POST",
        	data: "ruta=" + ruta
   		}).done(function(res){
			toggleLoading();

   			archivos = jQuery.parseJSON(res);
   			objHtml = renderizarTabla(archivos);

			if(objHtml.cont == 0) {
				html = "No se han encontrado archivos .properties";
			} else {
				html2 = "<div id='contIdioma'><label>Seleccione idioma origen</label>&nbsp;<select id='cboIdiomaOrigen' name='idiomas'>";

				for(var x=0;x < idiomas.length;x++){
					html2 += "<option value='" + idiomas[x].codigo + "'>" + idiomas[x].descripcion + "</option>";
				}
				html2 += "</select></div>";
				html2 += "<div id='contIdiomaDestino'><label>Seleccione idioma destino</label>&nbsp;<select id='cboIdiomaDestino' name='idiomas'>";
				html2 += "<option value='en'>Ingl&eacute;s</option><option value='es'>Espa&ntilde;ol</option><option value='fr'>Franc&eacute;s</option><option value='pt'>Portugu&eacute;s</option></select></div>";
				html2 += "<div id='revisarTraduccion'>Permitir modificar traducciones <input type='checkbox' id='chkRevisar'/> </div> <div id='contTraducir'><button class='boton' id='btnTraducir'>Traducir</button></div>";
				html = html2 + objHtml.html;
			}

			$("#archivos").html(html);
			$("#archivos").show();
			$('#cboIdiomaOrigen').change(function(e){
			  cambiarIdioma(archivos);
			});

			$('#btnTraducir').click(function(e){
				if ($("#contArchivos input[type=checkbox]:checked").length == 0) {
					alert("Por favor, seleccione archivos a traducir");
				} else {
					$('#ruta').prop('disabled', true);
					$('#ruta').css('background-color', '#f5f7f6');
					$('#submitButton').hide();
					var idiomaOrigen = $("#cboIdiomaOrigen").val();
					var idiomaDestino = $("#cboIdiomaDestino").val();
					archivosSeleccionados = [];
					$("#contArchivos input[type=checkbox]:checked").each(function(){
						//cada elemento seleccionado
						var nombre = $(this).attr("data-file");
						var path = $(this).attr("data-ruta");
						var idioma = $(this).attr("data-idioma");
						archivosSeleccionados.push({nombre:nombre,ruta:path,idioma:idioma});
					});
					toggleLoading();
					$('#archivos').hide();
					$("#btnTraducir").attr("disabled", true);
				  	$.ajax({
			        	url: 'controller.php',
			        	method: "POST",
			        	data: "archivos=" + JSON.stringify(archivosSeleccionados) + "&origen=" + idiomaOrigen + "&destino=" + idiomaDestino
			   		}).done(function(res){
						res = $.parseJSON(res);
						toggleLoading();
						$("#btnTraducir").attr("disabled", false);
						if (!document.getElementById("chkRevisar").checked) {
							var finalStr = "La traducci&oacute;n se ha realizado satisfactoriamente. <br /><br />";
						} else {
							// var finalStr = "La traducci&oacute;n se ha realizado satisfactoriamente<br>" +
							var finalStr = "<h2>Revisi&oacute;n de las traducciones</h2><table style='margin-bottom:10px;'><tr><th>Archivo</th><th>Contenido</th><th>Guardar</th></tr>";
							jQuery.each(res, function(i, val) {
								finalStr += "<tr><td class='folder'>" + i;
								finalStr += "</td>";
								finalStr += "<td><textarea id='"+i+"' rows='4' cols='50'>";
								jQuery.each(val, function(iVal, valFin) {
									finalStr += valFin;
								});
								finalStr += "</textarea></td><td><button type='button' class='boton' onClick='saveFile(\"" + i + "\")'>Guardar</button></td><td style='display:none;' id='saved_"+i+"'>Guardado!</td></tr>";
							});
							finalStr += "</table>";
						}
						finalStr += "<tr><td><button type='button' class='boton' onClick='exportar();'>Exportar</button><button type='button' class='boton' onClick='location.reload();'>Terminar</button></td></tr>";
						$('#traductappForm').hide();
						$("#archivos").html(finalStr);
						$('#archivos').show();
		        	});
			   	}
			});
        });
	})
});

function saveFile(id) {
	var myTextToSave = document.getElementById(id).value;
  	$.ajax({
		url: 'controller.php',
		method: "POST",
		data: "individualFile=" + id + "&val=" + myTextToSave
	}).done(function(res){
		document.getElementById("saved_" + id).style.display = "block";
	});
}

function toggleSection(toShow = 'translate'){
	if (toShow == 'translate') {
		$('div#logs').hide();
		$('div#translate').show();
		$('#navTranslate').addClass('active');
		$('#navLogs').removeClass('active');
	} else {
		$('div#translate').hide();
		$('div#logs').show();
		$('#navLogs').addClass('active');
		$('#navTranslate').removeClass('active');

		$.ajax({
			url: 'controller.php',
			method: "POST",
			data: "logs=1"
		}).done(function(res){
			table = "";
			log = jQuery.parseJSON(res);
			$.each(log, function(id, registro) {
				if (table == "" && registro.length == 5) {
					table += "<table><tr><th class='fecha'>Fecha inicio</th><th class='fecha'>Fecha fin</th><th class='idioma'>Origen</th><th class='idioma'>Destino</th><th>Archivos traducidos</th></tr>";
				}
				if (registro.length == 5) {
					table += "<tr>";
					table += "<td>" + registro[0] + "</td>";
					table += "<td>" + registro[4] + "</td>";
					table += "<td>" + registro[1] + "</td>";
					table += "<td>" + registro[2] + "</td>";
					table += "<td class='archivo'>" + registro[3].replace(/ - /g, "<br />") + "</td>";
					table += "</tr>";
				}
			});
			if (table != "") {
				table += "</table>";
			}
			if (table != "") {
				$('#logs').html(table);
			}
		});
	}
}

function toggleLoading(e){
	$('#loading').toggle();
}

function obtenerIdioma(archivo){
	var nombre = archivo.split(".");
	nombre.pop();
	nombre = nombre.join(".");
	var aux = nombre.split("_");
	var idioma = aux.pop().toLowerCase();
	var objIdioma = {};
	if(idioma.length > 0 && idioma.length < 3){
		switch(idioma){
			case "es":
				objIdioma.descripcion = "Espa&ntilde;ol";
				objIdioma.codigo = "es";
			break;
			case "fr":
				objIdioma.descripcion = "Frances";
				objIdioma.codigo = "fr";
			break;
			case "pt":
				objIdioma.descripcion = "Portugu&eacute;s";
				objIdioma.codigo = "pt";
			break;
			default:
				objIdioma.descripcion = "Ingl&eacute;s";
				objIdioma.codigo = "en";
			break;
		}
	}
	else
	{
		objIdioma.descripcion = "Ingl&eacute;s";
		objIdioma.codigo = "en";
	}

	return objIdioma;

}

function renderizarTabla(listArchivos){
	html1 = "<div id='contArchivos'><table><tr><th></th><th>Carpeta</th><th>Archivo</th><th>Idioma</th></tr>";
		var cont = 0;
		$.each( listArchivos, function( ruta, archivo ) {
			for (var i=0; i < archivo.length; i++) {
				var nombreArchivo = archivo[i];
				var arch = nombreArchivo.split(".");
				var idioma = obtenerIdioma(nombreArchivo);

				if(codigosIdiomas.indexOf(idioma.codigo) === -1){
					idiomas.push(idioma);
					codigosIdiomas.push(idioma.codigo);
				}

				var check = "<input id="+ cont +" data-ruta='"+ ruta +"' data-file='"+ nombreArchivo +"' data-idioma='"+ idioma.codigo +"' type='checkbox' checked />";
				html1 += "<tr>";
				html1 += "<td>" + check + "</td>";
				html1 += "<td class='folder'>" + ruta + "</td>";
				html1 += "<td>" + nombreArchivo + "</td>";
				html1 += "<td>" + idioma.descripcion + "</td>";
				html1 += "</tr>";
				cont++;
			}

		});

		html1 += "</table></div>";

	return {cont:cont,html:html1};
}

function cambiarIdioma(listArchivos){
	var filtroIdioma = $("#cboIdiomaOrigen").val();
	var newArray = [];
	if(filtroIdioma != ""){
		html1 = "<div id='contArchivos'><table><tr><th></th><th>Carpeta</th><th>Archivo</th><th>Idioma</th></tr>";
		var cont = 0;
		$.each( listArchivos, function( ruta, archivo ) {
			for (var i=0; i < archivo.length; i++) {
				var nombreArchivo = archivo[i];
				var arch = nombreArchivo.split(".");
				var idioma = obtenerIdioma(nombreArchivo);
				if(codigosIdiomas.indexOf(idioma.codigo) === -1){
					idiomas.push(idioma);
					codigosIdiomas.push(idioma.codigo);
				}
				if(idioma.codigo == filtroIdioma){
					var check = "<input id="+ cont +" data-ruta='"+ ruta +"' data-file='"+ nombreArchivo +"' data-idioma='"+ idioma.codigo +"' type='checkbox' checked />";
					html1 += "<tr>";
					html1 += "<td>" + check + "</td>";
					html1 += "<td class='folder'>" + ruta + "</td>";
					html1 += "<td>" + nombreArchivo + "</td>";
					html1 += "<td>" + idioma.descripcion + "</td>";
					html1 += "</tr>";
					cont++;
				}
			}

		});
		html1 += "</table></div>";
		$("#contArchivos").html(html1);
	}
	else
	{
		objHtml = renderizarTabla(listArchivos);
		$("#contArchivos").html(objHtml.html);
	}


}

function exportar(){
	console.log(archivosSeleccionados);
	$.ajax({
		url: 'controller.php',
		method: "POST",
		data: "archivosExportar=" + JSON.stringify(archivosSeleccionados)
	}).done(function(res){
		//document.getElementById("saved_" + id).style.display = "block";
	});

}