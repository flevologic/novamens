<?php
$ruta = "";
if(isset($_POST["ruta"])){
  $ruta = $_POST["ruta"];
  $archivos = array();
  listar($ruta, $archivos);
  echo json_encode($archivos);
}
else if(isset($_POST["archivos"])){
  $idiomaOrigen = $_POST["origen"];
  $idiomaDestino = $_POST["destino"];
  $archivos = json_decode($_POST["archivos"]);

  for($i = 0; $i < count($archivos); $i++ ){
    $nombre = $archivos[$i]->nombre;
    $ruta = $archivos[$i]->ruta;
    $idioma = $archivos[$i]->idioma;

    print "$ruta => $nombre ($idioma)";

  }
  /*foreach ($archivos as $ruta => $archivo) {
      for($i = 0; $i < count($archivo); $i++ ){
          $nombre = explode(".", $archivo[$i]);
          array_pop($nombre);
          $nombre = implode(".", $nombre);
          $aux = explode("_", $nombre);
          $idioma = strtolower(array_pop($aux));
          if($idioma == $idiomaOrigen){
            print "$ruta => $archivo[$i]\n";
          }
      }
      
  }*/
}   

function listar($path, &$archivos){
    $dir = opendir($path);
    $files = array();
    while ($current = readdir($dir)){
        if( $current != "." && $current != "..") {
            if(is_dir($path.$current)) {
                listar($path.$current.'/', $archivos);
            }
            else {
                if(eregi(".*\.properties", $path.$current))
                  $files[] = $current;
            }
        }
    }
    if(count($files) > 0)
      $archivos[$path] = $files;
}

