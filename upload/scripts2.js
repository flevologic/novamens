//AJAX

 $.ajax({
        url: 'https://api.coderhouse.com/careers'
    }).done(function(response, status){
        var items = response.map(function(item){
            return {
                title: item.title,
                description: item.description
            }
        });

        for (var i = 0, l = items.length; i < l; i++) {
            var h3 = $('<h3/>');
            h3.text(items[i].title);
            $('body').append(h3);
        }
    });

 /*FULL REST - RESTFull - RESTafari
    Verbos = GET POST PUT DELETE
    CRUD = Create Read Update Delete */

    // GET traer
        - https://api.coderhouse.com/careers
    // GET traer uno por id
        - https://api.coderhouse.com/careers/:careerId
    // POST crear
        - https://api.coderhouse.com/careers, {}
    // PUT actualizar
        - https://api.coderhouse.com/careers/:careerId, {}
    // DELETE eliminar
        - https://api.coderhouse.com/careers/:careerId, {}


    $.getJSON('https://api.coderhouse.com/careers', function(res){
        console.log(1, res);
    });



    $.getJSON('./jsons/articules.json', function(res){
        articulos = res;
        console.log(2, articulos);
        var arrayFavs = articulos.filter(function(){});
        var categorias = articulos.map(function(item){
            return item.category;
        });
    });

    setTimeout(function(){
        console.log(3, articulos);
    }, 1000);

    console.log(1, articulos);

    $.getScript("script-2.js", function( data, textStatus, jqxhr ) {
      module.hola();
    });

    $('#btn-add-articles').on('click', function(){
        $.ajax({
            url: 'articulos.html',
            dataType: 'html'
        }).done(function (res) {
            $('#articles-container').html(res);
        });
    });