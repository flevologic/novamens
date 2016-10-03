$(document).ready(function() {
	toggleSection();
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
	var theFiles = e.target.files;
	var archivos = [];
	var html = "";
	if(theFiles.length > 0){
		html = "<table border=1><tr><th></th><th>Carpeta</th><th>Archivo</th></tr>";
		var cont = 0;
		for (var i=0, file; file=theFiles[i]; i++) {
			archivos[i] = file;
			var arch = file.name.split(".");
			if(arch[arch.length - 1] === "properties"){
				var ruta = file.webkitRelativePath.split("/");
				ruta.pop();
				ruta = ruta.join("/");
				var check = "<input type='checkbox' checked />";
				html += "<tr>";
				html += "<td>" + check + "</td>";
				html += "<td>" + ruta + "</td>";
				html += "<td>" + file.name + "</td>";
				html += "</tr>";
				cont++;
			}
		}
		html += "</table>";
		if(cont == 0){
			html = "No se han encontrado archivos .properties";
		}
	}
	else{
		html = "Se seleccionó un directorio sin archivos dentro.";
	}

	$("#archivos").html(html);
		//console.log(html);

}

function loading(container){
	var loading = $("<img/>");
	loading.attr("src","img/loading.gif");
	$("#"+container).append(loading);
}

