<?php
/* wifiMap
// Client per a l'ús de la llibreria class_unifi.php
------------------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2016, jsirera

this Unifi API client for wifiMap tool is based on the Unifi-API-browser by Slooffmaster https://github.com/malle-pietje/Unifi-API-browser 

*/

$action         = '';
$site_name      = '';
$selection      = '';
$data           = '';


include('../config.php');

if (isset($_GET['action'])) {
    $action = $_GET['action'];
}
    

/*
load the Unifi API connection class and log in to the controller
- if an error occurs during the login process, an alert is displayed on the page
*/
require('class.unifi.php');

$unifidata        = new unifiapi($controlleruser, $controllerpassword, $controllerurl, $site_id, $controllerversion);
$unifidata->debug = false;
$loginresults     = $unifidata->login();
$data 			  = "";

if($loginresults === 400) {
    $data = 'Login error';
}

switch ($action) {
    case 'list_clients':
        $selection  = 'list online clients';
        $data       = $unifidata->list_clients();
        break;
    case 'stat_allusers':
        $selection  = 'stat all users';
        $data       = $unifidata->stat_allusers();
        break;
    case 'stat_auths':
        $selection  = 'stat active authorisations';
        $data       = $unifidata->stat_auths();
        break;
    case 'list_guests':
        $selection  = 'list guests';
        $data       = $unifidata->list_guests();
        break;
	case 'list_devices':
        $selection  = 'list devices';
        $data       = $unifidata->list_aps();
        break;
    case 'list_users':
        $selection  = 'list users';
        $data       = $unifidata->list_users();
        break;
    default:
        break;
}


/*
if ($action == 'list_clients')
	echo '[{"_id":"542d5191c38b55042648a665","_is_guest_by_uap":false,"_last_seen_by_uap":1468226052,"_uptime_by_uap":6244,"ap_mac":"04:18:d6:5e:bf:d4","assoc_time":1468219808,"blocked":false,"bssid":"0e:18:d6:5f:bf:d4","bytes-r":0,"ccq":1000,"channel":1,"essid":"docent","first_seen":1412256145,"hostname":"android-108c945f3c5223ff","idletime":35,"ip":"172.31.1.102","is_guest":false,"is_wired":false,"last_seen":1468226052,"latest_assoc_time":1468219809,"mac":"60:e7:01:8c:3d:4c","noise":-96,"oui":"HuaweiTe","powersave_enabled":true,"qos_policy_applied":true,"radio":"ng","radio_proto":"ng","rssi":51,"rx_bytes":83862,"rx_bytes-r":0,"rx_packets":370,"rx_rate":6000,"signal":-45,"site_id":"54478d4f0455015f8a6b1e9f","tx_bytes":99863,"tx_bytes-r":0,"tx_packets":305,"tx_power":40,"tx_rate":72222,"uptime":6244,"user_id":"542d5191c38b55042648a665","vlan":0},{"_id":"54201567c38b5504a32ea665","_is_guest_by_uap":false,"_last_seen_by_uap":1468226052,"_uptime_by_uap":788,"ap_mac":"04:18:d6:5e:bf:d4","assoc_time":1468224803,"blocked":false,"bssid":"0e:18:d6:5f:bf:d4","bytes-r":45,"ccq":989,"channel":1,"essid":"docent","first_seen":1411388775,"hostname":"android-277f8afd9c3ee3e0","idletime":4,"ip":"172.31.0.178","is_guest":false,"is_wired":false,"last_seen":1468226052,"latest_assoc_time":1468225265,"mac":"48:5a:3f:1b:48:76","noise":-96,"oui":"Wisol","powersave_enabled":true,"qos_policy_applied":true,"radio":"ng","radio_proto":"ng","roam_count":11,"rssi":31,"rx_bytes":98846,"rx_bytes-r":25,"rx_packets":584,"rx_rate":1000,"signal":-65,"site_id":"54478d4f0455015f8a6b1e9f","tx_bytes":105883,"tx_bytes-r":20,"tx_packets":474,"tx_power":40,"tx_rate":72222,"uptime":1249,"user_id":"54201567c38b5504a32ea665","vlan":0},{"_id":"53ad626bf8075504e5ab96b3","_is_guest_by_uap":false,"_last_seen_by_uap":1468226052,"_uptime_by_uap":3675,"ap_mac":"04:18:d6:5e:bf:d4","assoc_time":1468222378,"blocked":false,"bssid":"0e:18:d6:5f:bf:d4","bytes-r":1,"ccq":991,"channel":1,"essid":"docent","first_seen":1403871851,"hostname":"Sexi","idletime":70,"ip":"172.31.0.147","is_guest":false,"is_wired":false,"last_seen":1468226052,"latest_assoc_time":1468222378,"mac":"dc:9b:9c:cc:24:a3","noise":-96,"oui":"Apple","powersave_enabled":true,"qos_policy_applied":true,"radio":"ng","radio_proto":"ng","rssi":51,"rx_bytes":943046,"rx_bytes-r":0,"rx_packets":5105,"rx_rate":24000,"signal":-45,"site_id":"54478d4f0455015f8a6b1e9f","tx_bytes":2232026,"tx_bytes-r":0,"tx_packets":3995,"tx_power":40,"tx_rate":72222,"uptime":3674,"user_id":"53ad626bf8075504e5ab96b3","vlan":0},{"_id":"53a05ee0f8075504f5a896b3","_is_guest_by_uap":false,"_last_seen_by_uap":1468226018,"_uptime_by_uap":1311,"ap_mac":"04:18:d6:00:67:69","assoc_time":1468224662,"bssid":"0e:18:d6:01:67:69","bytes-r":1,"ccq":974,"channel":1,"essid":"docent","first_seen":1403018976,"hostname":"judith","idletime":29,"ip":"172.31.0.216","is_guest":false,"is_wired":false,"last_seen":1468226018,"latest_assoc_time":1468224708,"mac":"14:5a:05:ec:6d:2a","noise":-101,"oui":"Apple","powersave_enabled":true,"qos_policy_applied":true,"radio":"ng","radio_proto":"ng","rssi":33,"rx_bytes":65934,"rx_bytes-r":0,"rx_packets":413,"rx_rate":65000,"signal":-68,"site_id":"54478d4f0455015f8a6b1e9f","tx_bytes":90816,"tx_bytes-r":0,"tx_packets":334,"tx_power":40,"tx_rate":65000,"uptime":1356,"user_id":"53a05ee0f8075504f5a896b3","vlan":0},{"1x_identity":"jsirera","_id":"573c1ecd04552ca50668fb79","_is_guest_by_uap":false,"_last_seen_by_uap":1468226071,"_uptime_by_uap":1127,"ap_mac":"24:a4:3c:dc:8d:71","assoc_time":1468224929,"blocked":false,"bssid":"2a:a4:3c:dd:8d:71","bytes-r":44,"ccq":925,"channel":1,"essid":"xarxa","first_seen":1463557837,"hostname":"Meizu-m2-note","idletime":16,"ip":"172.31.0.211","is_guest":false,"is_wired":false,"last_seen":1468226071,"latest_assoc_time":1468224945,"mac":"68:3e:34:58:28:d8","name":"","noise":-98,"noted":false,"oui":"MeizuTec","powersave_enabled":true,"qos_policy_applied":true,"radio":"ng","radio_proto":"ng","roam_count":1,"rssi":21,"rx_bytes":654128,"rx_bytes-r":25,"rx_packets":1198,"rx_rate":1000,"signal":-77,"site_id":"54478d4f0455015f8a6b1e9f","tx_bytes":342232,"tx_bytes-r":18,"tx_packets":1085,"tx_power":40,"tx_rate":52000,"uptime":1142,"user_id":"573c1ecd04552ca50668fb79","vlan":0},{"_id":"53709b901dad550446e1f50b","_is_guest_by_uap":false,"_last_seen_by_uap":1468226052,"_uptime_by_uap":159,"ap_mac":"04:18:d6:5e:bf:d4","assoc_time":1468221645,"bssid":"0e:18:d6:5f:bf:d4","bytes-r":16,"ccq":1000,"channel":1,"essid":"docent","first_seen":1399888784,"hostname":"iPhone-de-Carme","idletime":6,"ip":"172.31.0.139","is_guest":false,"is_wired":false,"last_seen":1468226052,"latest_assoc_time":1468225893,"mac":"28:e0:2c:bc:4e:76","noise":-96,"oui":"Apple","powersave_enabled":true,"qos_policy_applied":true,"radio":"ng","radio_proto":"ng","roam_count":1,"rssi":19,"rx_bytes":10605370,"rx_bytes-r":10,"rx_packets":7307,"rx_rate":39000,"signal":-77,"site_id":"54478d4f0455015f8a6b1e9f","tx_bytes":509902,"tx_bytes-r":6,"tx_packets":4489,"tx_power":40,"tx_rate":65000,"uptime":4407,"user_id":"53709b901dad550446e1f50b","vlan":0},{"_id":"577eb649045591294ef2bab9","_is_guest_by_uap":false,"_last_seen_by_uap":1468225847,"_uptime_by_uap":568,"ap_mac":"04:18:d6:62:31:db","assoc_time":1468225141,"bssid":"0e:18:d6:63:31:db","bytes-r":2542,"ccq":611,"channel":1,"essid":"docent","first_seen":1467921993,"hostname":"WHO","idletime":0,"ip":"192.168.2.22","is_guest":false,"is_wired":false,"last_seen":1468225847,"latest_assoc_time":1468225279,"mac":"70:f1:a1:cd:51:ca","noise":-99,"oui":"LiteonTe","powersave_enabled":false,"qos_policy_applied":true,"radio":"ng","radio_proto":"g","rssi":13,"rx_bytes":1345211,"rx_bytes-r":994,"rx_packets":12195,"rx_rate":1000,"signal":-86,"site_id":"54478d4f0455015f8a6b1e9f","tx_bytes":2518017,"tx_bytes-r":1547,"tx_packets":23990,"tx_power":40,"tx_rate":1000,"uptime":706,"user_id":"577eb649045591294ef2bab9","vlan":0},{"_id":"564c5521045580687b85cb7d","_is_guest_by_uap":false,"_last_seen_by_uap":1468225901,"_uptime_by_uap":262,"ap_mac":"04:18:d6:2c:b5:a4","assoc_time":1468225639,"blocked":false,"bssid":"0e:18:d6:2d:b5:a4","bytes-r":0,"ccq":778,"channel":1,"essid":"docent","first_seen":1447843105,"hostname":"android-dcc168a3116149a2","idletime":232,"ip":"172.31.0.108","is_guest":false,"is_wired":false,"last_seen":1468225901,"latest_assoc_time":1468225639,"mac":"3c:47:11:22:0a:ad","noise":-94,"oui":"HuaweiTe","powersave_enabled":true,"qos_policy_applied":true,"radio":"ng","radio_proto":"ng","rssi":8,"rx_bytes":0,"rx_bytes-r":0,"rx_packets":0,"rx_rate":1000,"signal":-86,"site_id":"54478d4f0455015f8a6b1e9f","tx_bytes":0,"tx_bytes-r":0,"tx_packets":5,"tx_power":40,"tx_rate":72222,"uptime":262,"user_id":"564c5521045580687b85cb7d","vlan":0},{"_id":"53b688c8f80755045dac96b3","_is_guest_by_uap":false,"_last_seen_by_uap":1468226052,"_uptime_by_uap":2254,"ap_mac":"04:18:d6:5e:bf:d4","assoc_time":1468223798,"blocked":false,"bssid":"0e:18:d6:5f:bf:d4","bytes-r":0,"ccq":991,"channel":1,"essid":"docent","first_seen":1404471496,"hostname":"android-f3f00958329ffc5d","idletime":4,"ip":"172.31.0.249","is_guest":false,"is_wired":false,"last_seen":1468226052,"latest_assoc_time":1468223799,"mac":"b4:52:7e:83:cd:04","noise":-96,"oui":"SonyMobi","powersave_enabled":true,"qos_policy_applied":true,"radio":"ng","radio_proto":"ng","rssi":20,"rx_bytes":680439,"rx_bytes-r":0,"rx_packets":3180,"rx_rate":6000,"signal":-76,"site_id":"54478d4f0455015f8a6b1e9f","tx_bytes":2384386,"tx_bytes-r":0,"tx_packets":3066,"tx_power":40,"tx_rate":72222,"uptime":2254,"user_id":"53b688c8f80755045dac96b3","vlan":0}]';
else*/
	echo json_encode($data);

/*
log off from the Unifi controller API
*/
$logout_results = $unifidata->logout();





