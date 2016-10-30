<?php

abstract class Traductor {

	abstract public function getToken();
	abstract public function traduct($jsonToTraductOnArray, $fromLanguage, $toLanguage);
	abstract public function saveIndividualFile($file, $data);
}

?>
