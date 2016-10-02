//Programacion funcional
var encontrar = function(items, id){
    var i = 0,
        l = items.length;

    for (i; i < l; i++){
        if (items[i].id === id) {
            return items[i];
        }    
    }
    return false;
}

var encontrarByFav = function(items){
    var favoritos = [];
    var i = 0,
        l = items.length;

    for (i; i < l; i++){
        if (items[i].fav) {
            favoritos.push(items[i]);
        }    
    }

    return favoritos;
};

var articulos = [{
    id: 1
},{
    id: 2,
    fav: true
},{
    id: 3,
    fav: t
}];

var articulo = encontrar(articulos, 2);
var favoritos = encontrarByFav(articulos);


var items = [1,2,3,4,5,6,7,8,9];

// $.each(items, function(item){
//     console.log(item);
// });

if (!$.isArray(items)) {
    console.log('si es array');    
}

$.inArray(items, 7);

var objectoA = {
    prop: 1
};

var objectoB = {
    attr: 2,
    prop: 2
};

var objectoC = $.extend({}, objectoB, objectoA);


var articulo = {
    id: 123,
    titulo: '123',
    fav: false
};

$.extend(articulo, {
    fav: true,
    description: 123,
    otra: 123,
    asd: 123,
    asdasd: 'asdasd'
});

[].concat([1,2,3,4,5], [4,6,3,1,8,9,10]);

$.merge([], [1,2,3,4,5], [4,6,3,1,8,9,10]);

// .map()
// .filter()
// .find()
// .forEach()

var items = [{
    id: 123,
    titulo: 'articulo-1',
    fav: true
},{
    id: 456,
    titulo: 'articulo-2',
    fav: false
},{
    id: 789,
    titulo: 'articulo-3',
    fav: false
}];

var titlosDeArticulos = $.map(items, function(item){
    return {
        title: item.titulo
    };
});

var titlosDeArticulos = items.map(function(item){
    return {
        title: item.titulo
    };
});

function find(items, id, callback) {
    for (var i = 0, l = items.length; i < l; i++) {
        if (items[i].id === id) {
            if (callback) {
                callback(items[i]);
            }

            return items[i];
        }
    }
}

find(items, 789, function(item){
    console.log(item)
});

var items = [{
    id: 123,
    titulo: 'articulo-1',
    fav: true
},{
    id: 456,
    titulo: 'articulo-2',
    fav: false
},{
    id: 789,
    titulo: 'articulo-3',
    fav: true
}];
var itemsFiltrados = items.filter(function(item){
    return item.fav;
});

items.forEach(function(item, index){
    console.log(item, index);
});

var item = items.find(function(item){
    if (item.id === 456) {
        return item;
    }
    return false;
});



//Funciones callback
function find(items, id, callback) {
    for (var i = 0, l = items.length; i < l; i++) {
        if (items[i].id === id) {
            if (callback) {
                callback(items[i]);
            }

            return items[i];
        }
    }
}

find(items, 789, function(item){
    console.log(item)
});











