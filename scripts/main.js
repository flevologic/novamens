$(document).ready(function() {
	toggleSection();
	archivos = "";
	idiomas = [];
	codigosIdiomas = [];

	$("#traductappForm").submit(function(e){
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

			if(objHtml.cont == 0){
				html = "No se han encontrado archivos .properties";
			}
			else{
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
			$('#cboIdiomaOrigen').change(function(e){
			  cambiarIdioma(archivos);
			});
			$('#btnTraducir').click(function(e){
				var idiomaOrigen = $("#cboIdiomaOrigen").val();
				var idiomaDestino = $("#cboIdiomaDestino").val();
				var archivosSeleccionados = [];
				$("#contArchivos input[type=checkbox]:checked").each(function(){
					//cada elemento seleccionado
					var nombre = $(this).attr("data-file");
					var path = $(this).attr("data-ruta");
					var idioma = $(this).attr("data-idioma");
					archivosSeleccionados.push({nombre:nombre,ruta:path,idioma:idioma});
				});
				toggleLoading();
				$("#btnTraducir").attr("disabled", true);
			  	$.ajax({
		        	url: 'controller.php',
		        	method: "POST",
		        	data: "archivos=" + JSON.stringify(archivosSeleccionados) + "&origen=" + idiomaOrigen + "&destino=" + idiomaDestino
		   		}).done(function(res){
					toggleLoading();
					$("#btnTraducir").attr("disabled", false);
		   			$("#archivos").html("La traducci&oacute;n se ha realizado satisfactoriamente");
		        });
			});
        });
	})
});

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
				html1 += "<td>" + ruta + "</td>";
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
					html1 += "<td>" + ruta + "</td>";
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



