$(document).ready(function() {
	toggleSection();
	$("#traductappForm").submit(function(e){
		e.preventDefault();
		$.ajax({
        	url: 'controller.php'
   		}).done(function(res){
        	$("#archivos").html(res);
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