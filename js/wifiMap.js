/*//////////////////////////////////////////////////////////////////////////////////////
// WifiMap
// 
// Joan Sirera

The MIT License (MIT)

Copyright (c) 2016, jsirera

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

//TODO canvi icona segons volum de dades
//TODO posar cercaa a dins del controls

var map, 			//Mapa
	APs = [],		//Array de AP
	usuaris = [],	//Array de usuaris
	inputCerca, checkboxAP, checkboxEtiquetes, botoRecarregar; //Interficie afegida al mapa
	
//Arranquem interval d'actualització
/**
 * Start everything
 * @param {div DOM object} Div containter for google map
 * @param {div DOM object} Div container for controls
 * @param {input text DOM object} User text search box
 * @param {img DOM object} image for refresh button
 * @param {input checkbox DOM object} Checkbox. show/hide AP's
 * @param {input checkbox DOM object} Checkbox. show/hide labels
 */
function start(divMapa, divControls, formInputCerca, formBotoRecarregar, formCheckboxAP, formCheckboxEtiquetes){
	inputCerca = formInputCerca;
	checkboxAP = formCheckboxAP;
	checkboxEtiquetes = formCheckboxEtiquetes
	botoRecarregar = formBotoRecarregar;
	map = initMap(divMapa, divControls);
		
	//Afegeix event al checkbox de mostrar APs
	checkboxAP.addEventListener('change', function(event) {
		repintarAPs(APs, map, checkboxAP.checked, checkboxEtiquetes.checked);
	});
	//Afegeix event al checkbox de mostrar etiquetes
	checkboxEtiquetes.addEventListener('change', function(event) {
		repintarAPs(APs, map, checkboxAP.checked, checkboxEtiquetes.checked);
	});
	//Afegeix event al boto de recarregar
	botoRecarregar.addEventListener('click', function(event) {
		carregarDades();
	});
		
	//Arranquem refresc automatic
	var interval = setInterval(function(){carregarDades();	;}, AUTO_ACTUALITZACIO * 1000);
	
	//Arranquem moviment rotacio clients
	var interval = setInterval(function(){moureUsuaris(usuaris, map);}, 1 /FPS * 1000);

	carregarDades(); //Cridem un primer cop a carregar dades
}

/**
 * Initialize the map with form elements. Require a div element in the DOM with id = "map"
 * @param {div object} Map container
 * @param {div object} Controls container
 * @return {google map object} Map
 */
function initMap(divMapa, divControls) {
	var opcionsMapa = {
			zoom: ZOOM_INICIAL,			
			center: LAT_LON_INICAL,
			scaleControl: true,
			panControl:true,
			zoomControl:true,
			mapTypeControl:true,
			streetViewControl:true,
			overviewMapControl:true,
			rotateControl:true
	};
	map = new google.maps.Map(divMapa, opcionsMapa);
	// Create the search box and link it to the UI element.
	var searchBox = new google.maps.places.SearchBox(inputCerca);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputCerca);
	// Afegir controls al mapa
	divControls.index = 1;
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(divControls);

	return map;
}

/**
 * Load AP and users using unifi-api
 */
function carregarDades(){
	botoRecarregar.src = "images/refresh.gif";//className = "botoClicat"; //Indiquem que la petició s'esta processant
	$.getJSON( "unifi-api/?action=list_devices", function( data ) {
		eliminarMarkers(APs);
		APs = afegirAPs(data, map);
		repintarAPs(APs, map, checkboxAP.checked, checkboxEtiquetes.checked);
		$.getJSON( "unifi-api/?action=list_clients", function( data ) {
			eliminarMarkers(usuaris);
			usuaris = afegirUsuaris(data, APs, map);
			botoRecarregar.src = "images/refresh.png"; //Indiquem que la petició ha acabat
		});	
	});
}


/**
 * Create Marker, overlay text and infoWindow on the MAP for each AP
 * @param {javascript data} AP data 
 * @param {google map object} the map
 * @return {Array} Array of Google Maps Markers
 */
function afegirAPs(objAPs, map){
	var markers = [];
	var imgAPon={
		url: 'images/ap_on.png',
		anchor: new google.maps.Point(10,10)
	};
	var imgAPoff={
		url: 'images/ap_off.png',
		anchor: new google.maps.Point(10,10)
	};

	for (var i = 0; i < objAPs.length; i++){
		var ap = objAPs[i], imgAP;
		if (ap.state != 1) imgAP = imgAPoff; else imgAP = imgAPon; //Si el AP no esta actiu -> imatge vermella
		var latlng = new google.maps.LatLng(ap.x, ap.y);
		var txt = new TxtOverlay(latlng, ap.name, "etiquetaAP", map)
		var marker = new google.maps.Marker({
			position: {lat: ap.x, lng: ap.y},
			map: map,
			dades: ap, //Desem tota la informació de l'AP al mateix marker
			txtOverlay: txt, //Desem objecte txtOverlay (etiqueta)
			//animation: google.maps.Animation.DROP,
			icon: imgAP,
			title: ap.name + " (" + ap.connect_request_ip + ") Usuaris: " + ap.num_sta ,
			zindex: 1
		});
		
		var imgAPFinestra = 'images/ap_on.png';
		if (ap.state != 1) { 
			imgAPFinestra = 'images/ap_off.png'; 
			var content = '<div class="finestraPropietats">'+
							'<h1 class="firstHeading">'+
								'<img src="images/ap_off.png"> ' + ap.name + ' - No actiu' +
							'</h1>'+
						  '</div>';
		}
		else{
			var content = '<div class="finestraPropietats">'+
							'<h1 class="firstHeading">'+
								'<img src="images/ap_on.png"> ' + ap.name +
							'</h1>'+
							'<div>'+
								'<p><ul>' +
									'<li>MAC: <b>' + ap.mac + '</b></li>'+
									'<li>Velocitat: <b>' + ap.uplink.speed + '</b></li>'+
									'<li>ip: <b>' + ap.config_network.ip + '</b> (' + ap.config_network.type + ') </li>'+
									'<li>mascara: ' +  ap.config_network.netmask + '</li>'+
									'<li>Gateway: ' + ap.config_network.gateway + '</li>'+
									'<li>DNS: ' + ap.config_network.dns1 + '</li>'+
								'</ul></p>'+
							'</div><div>'+
								'<h2><ul>' +				
									'<li>Estacions: <b>' + ap.num_sta + '</b></li>' +								
									'<li>RX: <b>' + humanFileSize(ap.rx_bytes,false) + '</b></li>' +
									'<li>TX: <b>' + humanFileSize(ap.tx_bytes,false)+ '</b></li>' +
								'</ul></h2>'+
							'</div>'+
						  '</div>';
		}
		//Contingut de la finestra d'informació
		var infowindow = new google.maps.InfoWindow()

		google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
			return function() {
				if(isInfoWindowOpen(infowindow))
					infowindow.close();
				else{
					infowindow.setContent(content);
					infowindow.open(map,marker);
				}
			};
		})(marker,content,infowindow)); 	
		markers.push(marker);
	}
	return markers;
}


/**
 * Show o hide Markers and overlay text fo APs.
 * @param {Array} AP Markers array 
 * @param {google map object} map
 * @param {Boolean} Indicates if AP icon must be showed in the map.
 * @param {Boolean} Indicates if AP label must be showed in the map.
  */
function repintarAPs(APs, map, mostrarAP, mostrarEtiquetes){
	for (var i = 0; i < APs.length; i++){
		if(mostrarAP) {
			APs[i].setVisible(true); //mostrem marker
			if (mostrarEtiquetes) APs[i].txtOverlay.setMap(map); //mostrem etiqueta
			else APs[i].txtOverlay.setMap(null); //amaguem etiqueta
		}
		else {
			APs[i].setVisible(false);	//amaguem marker
			APs[i].txtOverlay.setMap(null); //amaguem etiqueta
		}
	}	
	
}

/**
 * Create Marker, overlay text and infoWindow on the MAP for each Wifi user
 * @param {javascript data} Users data 
 * @param {javascript data} APs data 
 * @param {google map object} the map
 * @return {Array} Array of Google Maps Markers
 */
function afegirUsuaris(objUsuaris, APs, map){
	var markers = [];
	var imgUsuari1={
		url: 'images/usuari1.png',
		//size: new google.maps.Size(80, 80),
		//origin: new google.maps.Point(30,30),
		anchor: new google.maps.Point(0,1)//(47,1)
	};
	var imgUsuari2={
		url: 'images/usuari2.png',
		//size: new google.maps.Size(80, 80),
		//origin: new google.maps.Point(30,30),
		anchor: new google.maps.Point(0,1)//(47,1)
	};
	for (var i = 0; i < objUsuaris.length; i++){
		var usuari = objUsuaris[i];
		var imatge = imgUsuari1;
		if (usuari.hasOwnProperty('note') && usuari['note'].toLowerCase().indexOf(NOTA_USUARIS_DIFERENTS) >-1) imatge = imgUsuari2; // Si s'ha de pintar de color diferent...
		var AP = cercarAPUsuari(APs,usuari.ap_mac); //Cerquem el ap del usuari
		var distancia = -(usuari.signal ) * FACTOR_COBERTURA_DISTANCIA; //Distancia al AP proporcional a la cobertura
		var angle = Math.random() * 2 * Math.PI;	//Creem angle aleatori en radiants
		var latLngUsuari = calculPosicioUsuari(AP.dades.x, AP.dades.y, distancia, angle);
		var latLngAP = new google.maps.LatLng(AP.dades.x, AP.dades.y);  //Desem posicio AP al mateix usuari per a tindre-ho mes a mà
		var etiqueta;
		//Consultem si el usuari s'ha autenticat amb radius
		if(usuari.hasOwnProperty('1x_identity') && usuari['1x_identity'] != "") etiqueta = (usuari['1x_identity']); //Si existeix usuari, l'afegim a l'etiqueta
		else if(usuari.name != undefined)  etiqueta = usuari.name; //Si no provem de posar el nom definit al controlador unifi
		else etiqueta = usuari.hostname; //Si tampoc, aleshores posem el nom de host
		var txt = new TxtOverlay(latLngUsuari, etiqueta, "etiquetaUsuari", map)
		var marker = new google.maps.Marker({
			position: latLngUsuari,/*{lat: latUsuari, lng: lngUsuari},*/
			map: map,
			dades: usuari, 		//Desem tota la informació del usuari al mateix marker
			txtOverlay: txt, 	//Desem objecte txtOverlay (etiqueta)
			angle: angle, 		//Desem l'angle creat aleatoriament per poder mouse posteriorment
			distancia: distancia,//Desem la distancia calculada per poder moure posteriorment
			posicioAP: latLngAP, //Desem posicio AP al mateix usuari per a tindre-ho mes a mà
			//animation: google.maps.Animation.BOUNCE,
			icon: imatge,
			title: usuari.hostname,
			zindex: 5
		});
		var nomPersonalitzat = "";
		if(usuari.hasOwnProperty('1x_identity')) nomPersonalitzat += usuari['1x_identity'];
		if(usuari.hasOwnProperty('name')) nomPersonalitzat += " " + usuari['name'];
		var content = '<div class="finestraPropietats">'+
							'<h1 class="firstHeading">'+
								'<img src="' + imatge.url + '"> ' + usuari.hostname +
							'</h1>'+
							'<div>'+
								'<p><ul>' +
									'<li>Nom usuari: <b>' + nomPersonalitzat + '</b></li>'+
									'<li>Nom de host: <b>' + usuari.hostname + '</b></li>'+
									'<li>Dispositiu: <b>' + usuari.oui +' </b></li>'+
									'<li>Ip: <b>' +  usuari.ip + '</b></li>'+
									'<li>MAC: <b>' + usuari.mac + '</b></li>'+
									'<li>AP: <b>' + AP.dades.name + '</b></li>'+
									'<li>SSID: <b>' + usuari.essid + '</b></li>'+
									'<li>Canal: <b>' + usuari.channel + ' ('+ usuari['radio'] +')</b></li>'+
									'<li>Senyal: <b>' + usuari.signal + 'dB '+ senyal2Qualitat(usuari.signal) +'%</b></li>'+
									'<li>Primera connexi&oacute;: <b>' + humanMillis(usuari.first_seen) + '</b></li>'+
									'<li>assoc_time: <b>' + humanMillis(usuari.assoc_time) + '</b></li>'+
									'<li>latest_assoc_time: <b>' + humanMillis(usuari.latest_assoc_time) + '</b></li>'+
									'<li>Ultima activitat fa: <b>' + segonsDesde(usuari.last_seen) + ' segons</b></li>'+
									
								'</ul></p>'+
							'</div><div>'+
								'<h2><ul>' +				
									'<li>Baixat: <b>' + humanFileSize(usuari.tx_bytes,false) + '</b></li>' +
									'<li>Pujat: <b>' + humanFileSize(usuari.rx_bytes,false)+ '</b></li>' +
								'</ul></h2>'+
							'</div>'+
					 '</div>';
		
		var infowindow = new google.maps.InfoWindow()

		google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
			return function() {
				if(isInfoWindowOpen(infowindow))
					infowindow.close();
				else{
					infowindow.setContent(content);
					infowindow.open(map,marker);
				}
			};
		})(marker,content,infowindow)); 
		markers.push(marker);
	}
	return markers;
}

/**
 * Rotate user markers arround the AP
 * @param {Array} Users 
 * @param {google map object} the map
 */
function moureUsuaris(usuaris, map){
	//Si s'ha fet algun cerca...
	var cadenaCerca = inputCerca.value.toLowerCase();
	
	//google.maps.visualRefresh = false;
	for (var i = 0; i < usuaris.length; i++){
		var mostrar = false;
		var usuari = usuaris[i];
		
		if (cadenaCerca == "") mostrar = true; //Si no estem cercant res -> el marquem per mostrar
		else{ //Si estem cercant -> el cerquem a totes les cadenes d'informació (nostname, usuari radius, SSID, xarxa, fabricant telefon...)
			var usuariRadius = (usuari.dades.hasOwnProperty('1x_identity') && usuari.dades['1x_identity'].toLowerCase().indexOf(cadenaCerca) >-1);
			var nomUnifi = (usuari.dades.hasOwnProperty('name') && usuari.dades['name'].toLowerCase().indexOf(cadenaCerca) >-1);
			var essid = usuari.dades.essid.toLowerCase().indexOf(cadenaCerca)>-1;
			var hostname = usuari.dades.hostname.toLowerCase().indexOf(cadenaCerca)>-1 ;
			var ip = usuari.dades.ip.toLowerCase().indexOf(cadenaCerca)>-1;
			var mac = usuari.dades.mac.toLowerCase().indexOf(cadenaCerca)>-1;
			var oui = usuari.dades.oui.toLowerCase().indexOf(cadenaCerca)>-1;
			var noteUnifi = (usuari.dades.hasOwnProperty('note') && usuari.dades['note'].toLowerCase().indexOf(cadenaCerca) >-1);
			if (usuariRadius || nomUnifi || essid || hostname || ip || mac || oui || noteUnifi) mostrar = true;
		}
	
		//usuari.txtOverlay.setMap(null); //amaguem etiqueta
		if (mostrar){
			//Calculem angle per afegir a la rotació del usuari en funcio de la cobertura (com mes cobertura mes velocitat)
			usuari.angle = ((RPM/(-usuari.dades.signal/20))/60 * 2 * Math.PI)/FPS + usuari.angle;
			var novaLatLngUsuari = calculPosicioUsuari(usuari.posicioAP.lat(), usuari.posicioAP.lng(), usuari.distancia, usuari.angle);
			usuari.setPosition( novaLatLngUsuari );
			if (checkboxEtiquetes.checked){ // Si s'ha de mostrar l'etiqueta, l'actualitzem a la posicio i la mostrem
				usuari.txtOverlay.moure(novaLatLngUsuari);
				usuari.txtOverlay.show();
			}
			else
				usuari.txtOverlay.hide();
			usuari.setVisible(true);
				
		}
		else{
			usuari.setVisible(false);
			usuari.txtOverlay.hide();
		}
	
	}

}

/**
 * Search AP for the wifi user by MAC
 * @param {Array} APs 
 * @param {String} MAC of the user device
 * @return {google maps marker} The AP of the user
 */
function cercarAPUsuari(APs,mac){
	for (var i = 0; i < APs.length; i++){
		if (APs[i].dades.mac == mac)
			return APs[i];
	}
	return null;
}

/**
 * Erase MAP markers and overlays
 * @param {Array} Markers to erase 
 */
function eliminarMarkers(arrayMarkers){
	for (var i = 0; i < arrayMarkers.length; i++){
		arrayMarkers[i].setMap(null);
		arrayMarkers[i].txtOverlay.setMap(null); //amaguem etiqueta
	}
}

/**
 * Calculate a point from another point and vector (angle + distance)
 * @param {Number} X
 * @param {Number} Y
 * @param {Number} Distance from the first pont
 * @param {Number} Angle
 * @return {google maps LatLng object} New point
 */
function calculPosicioUsuari(x, y, distancia, angle){
	var novaX = x + distancia * Math.cos(angle);
	var novaY = y + distancia * Math.sin(angle);
	var latLng = new google.maps.LatLng(novaX, novaY);
	return (latLng);
}

/**
 * Check if InfoWindow is open
 * @param {infoWindow object} infoWindow object
 * @return {Boolean} returns true if infoWindow is open
 */
function isInfoWindowOpen(infoWindow){
    var map = infoWindow.getMap();
    return (map !== null && typeof map !== "undefined");
}

/**
 * Return 'human friendly' amount of data
 * @param {Number} bytes
 * @param {Boolean} True for 1024 notation (kB, MB..) or false for metric notation (KiB, MiB)
 * @return {String} Amount of data
 */
function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

/**
 * Converts dBm signal to qualiti percentage
 * @param {Number} dBm signal
 * @return {Number} Percentage of signal
 */
function senyal2Qualitat(dBm){
	// dBm to Quality:
    if(dBm <= -100)
        return (0);
    else if(dBm >= -50)
        return (99);
    else
        return (2 * (dBm + 100));
}

/**
 * Convert seconds from 01/01/1970 (ubiquiti notation) to date
 * @param {Number} seconds
 * @return {String} Date
 */
function humanMillis(segons){
	var date = new Date(segons * 1000);
	return (date.toLocaleDateString() + " " + date.toLocaleTimeString());	
}

/**
 * Calculate seconds from date to now
 * @param {Number} Secons from 01/01/1970 to event
 * @return {Number} seconds
 */
function segonsDesde(data){
	var ara = new Date();
	millisAra = ara.getTime();
	millisEvent = data*1000;
	millisDiferencia = millisAra - millisEvent;
	return (Math.round(millisDiferencia/1000));

}
