<?
listar("dirs/java-src/", $archivos); 

function listar($directorio, $archivos){                                               
    $archivos = "";   
    $puntos = array('.', '..'); // exluimos.                       
    $item = array_diff(scandir($directorio), $puntos);
       
    natsort($item);

    foreach($item as $archivo) {
                    
        $ruta = $directorio.$archivo;
                   
        if (is_dir($ruta)){
           //solo si el archivo es un directorio, distinto que "." y ".."
           $info = pathinfo($archivo);
           $archivos .= '{"ruta":"' . $directorio . '"},';
//                          echo "<ul><li><span class=\"folder\">".$info['filename']."</span></li></ul>";

           listar($ruta."/");
        }

        if (is_file($ruta)) {      
           	
            $info = pathinfo($archivo);
            $archivos .= '{"ruta":"' . $directorio . '","archivo":"' . $archivo . '"},';
//                        echo '<li><a href="'.$ruta.'">'.$info["filename"].'</a></li>';

        }                      
    }
    echo $archivos;

}


    
   /* echo "<ul id=\"browser\" class=\"filetree treeview-famfamfam\">";  
    listar_archivos($_SERVER['DOCUMENT_ROOT']."/evaluaciones2/uploads/"); 
    echo "</ul>"; */
/*function listar($ruta){
	$archivos = array();
   if (is_dir($ruta)) {
      if ($dir = opendir($ruta)) {
         while (($file = readdir($dir)) !== false) {
         	//if ($file != "." && $file != "..") {
         		array_push($archivos, $file);
         		//echo "$file - " . filetype($ruta . $file); 
         	//}
         }
      closedir($dir);
      echo json_encode($archivos);
      }
   }else
      echo json_encode("Ruta no valida");
} */

/* 
function uploadFiles(){
	$count = 0;
    $exito = 0;
    if ($_SERVER['REQUEST_METHOD'] == 'POST'){
	    foreach ($_FILES['files']['name'] as $i => $name) {
		    if (strlen($_FILES['files']['name'][$i]) > 1) {
			    if (move_uploaded_file($_FILES['files']['tmp_name'][$i], 'upload/'.$name)) {
			    	$count++;
			    	$exito = 1;
			    }
		    }
	    }
    }
 
    listar("upload/"); 

}*/
    