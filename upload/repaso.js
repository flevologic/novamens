$(function(){
    $.ajax({
        url: 'http://jsonplaceholder.typicode.com/users'
    }).done(function(usuarios){
        console.log(usuarios);

        var collectionNueva = [];
        
        // Programacion NO funcional
        // for (var i = 0, l = usuarios.length; i < l; i++) {
        //     collectionNueva.push({
        //         nombre: usuarios[i].username,
        //         telefono: usuarios[i].phone
        //     });
        // }

        // Programacion funcional
        collectionNueva = usuarios.map(function(usuario){
            return {
                 id: usuario.id,
                 email: usuario.email,
                 nombre: usuario.username,
                 telefono: usuario.phone,
                 getNombreConTelefono: function(){
                    return this.nombre + " y el tel es: " + this.telefono;
                 }
             };
        });

        console.log(collectionNueva);
        console.log(collectionNueva[4].getNombreConTelefono());

        var encontrarId = 5;
        //El find devuelve solo un objeto. Si la condicion trae muchos
        //, se queda con el primero
        var usuarioX = collectionNueva.find(function(usuario){
            return usuario.id === encontrarId;
        })

        //El filter devuelve un array de objetos.
        var usuariosX = collectionNueva.filter(function(usuario){
            return usuario.id >= encontrarId && usuario.id <= 8;
        })

        console.log(usuarioX,usuariosX);

        //El forEach
        var usuariosFor = collectionNueva.forEach(function(item, index){
            item.id = 1;
        })
        console.log(usuariosFor);

        //Guardo el elemento en memoria y despues la utilizo
        /*var $body = $("body");
        $body.find("ul");*/

    });
});