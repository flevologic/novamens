$(document).ready(function() {
	toggleSection();
	archivos = [];
	idiomas = [];
	codigosIdiomas = [];
	$('#files').click(function(e){
	  toggleLoading();
	});
	$('#files').change(function(e){
		//var tmppath = URL.createObjectURL(event.target.files[0]);
		//console.log(event.target.files[0]);
	  selectFolder(e);
	});



	/*$("#traductappForm").submit(function(e){
		e.preventDefault();
		$.ajax({
        	url: 'controller.php'
   		}).done(function(res){
        	$("#archivos").html(res);
        });
	})*/
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

function selectFolder(e) {
	//console.log(e);
	var theFiles = e.target.files;
	var html = "";
	archivos = theFiles;
	idiomas = [];
	codigosIdiomas = [];
	if(theFiles.length > 0){
		objHtml = renderizarTabla(theFiles);

		if(objHtml.cont == 0){
			html = "No se han encontrado archivos .properties";
		}
		else{
			html2 = "<div id='contIdioma'><label>Seleccione idioma origen</label><select id='cboIdioma' name='idiomas'><option value='todos'>Todos</option>";

			for(var x=0;x < idiomas.length;x++){
				html2 += "<option value='" + idiomas[x].codigo + "'>" + idiomas[x].descripcion + "</option>";
			}
			html2 += "</select></div>";
			html = html2 + objHtml.html;
		}
	}
	else{
		html = "Se seleccion&oacute; un directorio sin archivos dentro.";
	}

	$("#archivos").html(html);
				toggleLoading();

	$('#cboIdioma').change(function(e){
	  cambiarIdioma(theFiles);
	});
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
			case "po":
				objIdioma.descripcion = "Portugu&eacute;s";
				objIdioma.codigo = "po";
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
		for (var i=0, file; file=listArchivos[i]; i++) {
			var arch = file.name.split(".");
			if(arch[arch.length - 1] === "properties"){
				var ruta = file.webkitRelativePath.split("/");
				ruta.pop();
				ruta = ruta.join("/");
				var idioma = obtenerIdioma(file.name);

				if(codigosIdiomas.indexOf(idioma.codigo) === -1){
					idiomas.push(idioma);
					codigosIdiomas.push(idioma.codigo);
				}


				var check = "<input id="+ i +" data-ruta='"+ ruta +"' data-file='"+ file.name +"' data-idioma='"+ idioma.codigo +"' type='checkbox' checked />";
				html1 += "<tr>";
				html1 += "<td>" + check + "</td>";
				html1 += "<td>" + ruta + "</td>";
				html1 += "<td>" + file.name + "</td>";
				html1 += "<td>" + idioma.descripcion + "</td>";
				html1 += "</tr>";
				cont++;
			}
		}
		html1 += "</table></div>";

	return {cont:cont,html:html1};
}

function cambiarIdioma(listArchivos){
	var filtroIdioma = $("#cboIdioma").val();
	var newArray = [];
	if(filtroIdioma != "todos"){
		for (var i=0, file; file=listArchivos[i]; i++) {
			var idioma = obtenerIdioma(file.name);
			if(idioma.codigo == filtroIdioma){
				newArray.push(file);
			}
		}
	objHtml = renderizarTabla(newArray);
	}
	else
	{
		objHtml = renderizarTabla(listArchivos);
	}

	$("#contArchivos").html(objHtml.html);

}



