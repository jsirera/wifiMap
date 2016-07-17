# wifiMap - Unifi clients on google maps
wifiMap is a visual representation of the Ubiquiti Unifi clients and devices on Google Maps, written in javascript.

- Clients and devices from Unifi Controller are represented on google maps. Only supports versions 4.x.x of the Unifi Controller software and higher.

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
	<li>Radius user name (if you use RADIUS Auth Server for wireless network credentials)</li></ul>
 - You can view AP and station properties by click.
 - AP and labels can be hidden by checkbox.
 - Show user labels in orange or red color by RX TX data transfer.
 - The ability to show some stations with different color putting a text on the note station properties in unifi Controller


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
- Unifi controller software 4.x.x or higher.
- Web server with PHP.
- network connectivity between this web server and the server (and port) where the Unifi controller is running.
- Google Maps API Key

### Installation
-Download project files or clone to published folder of your web server (with PHP support).

### Configuration
- Edit 'config.php' to configure credentials for Ubiquiti Unifi Controller. Site ID, IP, port, user and password.
- Edit 'config.js' to configure additional settings like FPS, refresh time... (see file for more details)
- Edit index.html and replace my Google Maps API Key with your KEY.

### Demo
- You can see a demo version with ficticious data at:
<a href="http://control.insmollerussa.cat/demowifimap/">Demo with ficticious data</a>

### Screenshot

![alt tag](https://github.com/jsirera/wifiMap/blob/master/images/example.jpg "Sample screenshot")
