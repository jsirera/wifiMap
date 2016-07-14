<?php
/*
Configuració WiFiMap per a l'accés a les dades del controlador UniFi de Ubiquiti
Joan Sirera
*/

$site_id     		= 'default';					// Site name of Ubiquiti UniFi Controller
$controlleruser     = 'admin';         				// User name for access to the Unifi Controller
$controllerpassword = 'xxxxxx';          			// Password for access to the Unifi Controller
$controllerurl      = 'https://192.168.1.152:8443'; // Url to the Unifi Controller, eg. 'https://22.22.11.11:8443'
$controllerversion  = '5.0.7';          			// the version of the Controller software, eg. '4.6.6' (must be at least 4.0.0)
$debug              = false;       					// set to true (without quotes) to enable debug output to the browser and the PHP error log
?>