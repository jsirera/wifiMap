# wifiMap
wifiMap is a visual representation of the Ubiquiti Unifi users on Google Maps, written in javascript.

- Only supports versions 4.x.x of the Unifi Controller software and higher.

### Features
wifiMap tool offers the following features:
- Show AP and stations associated with each AP.
- Every station is moving arround his AP at signal equivalent distance.
- Search stations by:
	<ul><li>Name (unifi UI)</li>
	<li>Note (unifi UI)</li>
	<li>Device type</li>
	<li>SSID</li>
	<li>MAC</li>
	<li>IP</li>
	<li>Radius user name (if you use RADIUS Auth Server for wireless network credentials)</li><ul>
 - 


### Credits
The PHP API client that comes bundled with this tool is based on the work done by the following developers:
- domwo: http://community.ubnt.com/t5/UniFi-Wireless/little-php-class-for-unifi-api/m-p/603051
- fbagnol: https://github.com/fbagnol/class.unifi.php
- the API as published by Ubiquiti: https://www.ubnt.com/downloads/unifi/5.0.7/unifi_sh_api
- and the Unifi-API-browser by Slooffmaster
	https://github.com/malle-pietje/Unifi-API-browser 

Other included libraries:
- Google Maps API
- TxtOverlay
- jQuery (version 1.12.0) https://jquery.com/


### Requirements
- Web server with PHP.
- network connectivity between this web server and the server (and port) where the Unifi controller is running.
- Google Maps API Key

### Installation
-Download project files or clone to published folder of your web server (with PHP support).

### Configuration
-Edit 'config.php' to configure and config.js files.
-Create a Key for Google Maps API and copy...


