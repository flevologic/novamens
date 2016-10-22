<?php

class MicrosoftApiTranslator extends Traductor {

	private $clientID = "";
	private $clientSecret = "";
	private $authUrl = "";
	private $scopeUrl = "";
	private $grantType = "";
	private $authHeader = "";
	private $fromLanguage = "";
	private $toLanguage = "";

	function __construct($clientID, $clientSecret, $authUrl, $scopeUrl, $grantType) {
		$this->clientID = $clientID;
		$this->clientSecret = $clientSecret;
		$this->authUrl = $authUrl;
		$this->scopeUrl = $scopeUrl;
		$this->grantType = $grantType;
	}


	function getToken() {
		//Create the AccessTokenAuthentication object.
		$authObj      = new AccessTokenAuthentication();
		//Get the Access token.
		$accessToken  = $authObj->getTokens($this->grantType, $this->scopeUrl, $this->clientID, $this->clientSecret, $this->authUrl);
		//Create the authorization Header string.
		$this->authHeader = "Authorization: Bearer ". $accessToken;
	}

	function traduct($jsonToTraductOnArray, $fromLanguage, $toLanguage) {
		$finalArrayForTraductedFile = array();

		//Recorro todos los jsons
		foreach($jsonToTraductOnArray as $key => $value) {

			$finalArrayForTraductedFile = array();

			//Abro el archivo
			$fileToTraduct = fopen($value, "r");
			if ($fileToTraduct !== false) {

				//Obtengo el nombre del directorio
				$directoryToWrite = substr($value, 0, strrpos($value, DIRECTORY_SEPARATOR, 0));

				//Obtengo el nombre del archivo con extensión
				$fileExtension = substr(strrchr($value, DIRECTORY_SEPARATOR), 1);

				//Obtengo el nombre del archivo sin extensión
				$pos = strpos($fileExtension, "_");
				if ($pos === false) {
					$pos = strpos($fileExtension, ".");
				}
				$file = substr($fileExtension, 0, $pos) . "_" . $toLanguage . ".properties";

				//Leo cada línea del archivo
				while (!feof($fileToTraduct)) {
					$lineValue = fgets($fileToTraduct);

					//Separo Key Values
					$lineValue = explode("=",$lineValue);

					//Contemplo si hay '=' en el value
					if (sizeof($lineValue) > 2) {
						//Uno los value
						for($i = 2; $i < sizeof($lineValue); $i++) {
							$lineValue[1] .= "=".$lineValue[$i];
						}
					}
		
					//Mando a traducir
					try {
						$params = "text=".urlencode($lineValue[1])."&to=".$toLanguage."&from=".$fromLanguage;
						$translateUrl = "http://api.microsofttranslator.com/v2/Http.svc/Translate?$params";
		
						//Create the Translator Object.
						$translatorObj = new HTTPTranslator();
						    
						//Get the curlResponse.
						$curlResponse = $translatorObj->curlRequest($translateUrl, $this->authHeader);
						    
						//Interprets a string of XML into an object.
						$xmlObj = simplexml_load_string($curlResponse);
						foreach((array)$xmlObj[0] as $val){
							$translatedStr = $val;
							$finalArrayForTraductedFile[] = $lineValue[0]."=".$translatedStr;
						}
					} catch (Exception $e) {
						$finalArrayForTraductedFile[] = $e->getMessage();
					}
				}
				//Cierro el archivo leido
				fclose($fileToTraduct);

				//Me fijo si se guardo algo en el array final
				if (count($finalArrayForTraductedFile) > 0) {
					//Archivo donde guardo la traducción
					$finalFile = $directoryToWrite . DIRECTORY_SEPARATOR . $file;
					//Abro el nuevo archivo
					if (file_exists($finalFile)) {
						$handlerFinalFile = fopen($finalFile, "a");
					} else {
						$handlerFinalFile = fopen($finalFile, "w");
					}
					//Recorro los datos generados y los guardo
					for($i = 0; $i < sizeof($finalArrayForTraductedFile); $i++) {
						fwrite($handlerFinalFile, $finalArrayForTraductedFile[$i]);
					}
					//Cierro el archivo nuevo
					fclose($handlerFinalFile);
				}
			}
		}
	}
}

?>
