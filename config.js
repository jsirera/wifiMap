
///// Configuració ////////////////////////////////////////////////////////////////////
var LAT_LON_INICAL = {lat: 41.616950, lng: 0.8665};   	//Default map position
var ZOOM_INICIAL = 19;									//Default Zoom
var FACTOR_COBERTURA_DISTANCIA = 0.0000011;				//en: Relation between signal dB and distance to AP 
														//cat:Relació entre els dB i la distancia al AP. Com més gran mes es distanciaran els clients amb poca cobertura
var FPS = 20;											//Frames per second
var RPM = 2;											//RPM Revolucions per minut dels usuaris. RPM màxima dels usuaris amb mes cobertura
var DESPLACAMENT_HORITZONTAL_ETIQUETA_USUARIS = 49;		//en:User label left padding
														//cat:Deplaçament de l'etiqueta de clients cap a la dreta (en pixels)
var AUTO_ACTUALITZACIO = 60;							//Auto refresh period in seconds

var NOTA_USUARIS_DIFERENTS = "professor";				//en:User "note" propertie (unifi controler) to paint user in a different color
														//cat:Cadena que cerquem a la propietat "note" de Unifi per pintar l'usuari de color diferent
///////////////////////////////////////////////////////////////////////////////////////