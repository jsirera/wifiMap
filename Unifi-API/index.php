<?php
/* wifiMap
// Client per a l'ús de la llibreria class_unifi.php
------------------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2016, jsirera

this Unifi API client comes bundled with the wifiMap tool and is based on the work done by
  the following developers:
    domwo: http://community.ubnt.com/t5/UniFi-Wireless/little-php-class-for-unifi-api/m-p/603051
    fbagnol: https://github.com/fbagnol/class.unifi.php
  the API as published by Ubiquiti:
    https://dl.ubnt.com/unifi/4.7.6/unifi_sh_api
  and the Unifi-API-browser by Slooffmaster
	https://github.com/malle-pietje/Unifi-API-browser 

NOTE:
this Class will only work with Unifi Controller versions 4.x and higher. There are no checks to prevent
you from trying to use it with a pre-4.x version controller.

*/

$action         = '';

$site_name      = '';
$selection      = '';
$output_format  = 'json';
$theme          = 'bootstrap';
$data           = '';
$objects_count  = '';

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
$unifidata->debug = $debug;
$loginresults     = $unifidata->login();

if($loginresults === 400) {
    $data = 'Login error';
}

/*
select the required call to the Unifi Controller API based on the selected action
*/
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
    case 'list_usergroups':
        $selection  = 'list usergroups';
        $data       = $unifidata->list_usergroups();
        break;
    case 'stat_hourly_site':
        $selection  = 'hourly site stats';
        $data       = $unifidata->stat_hourly_site();
        break;
    case 'stat_sysinfo':
        $selection  = 'sysinfo';
        $data       = $unifidata->stat_sysinfo();
        break;
    case 'stat_hourly_aps':
        $selection  = 'hourly ap stats';
        $data       = $unifidata->stat_hourly_aps();
        break;
    case 'stat_daily_site':
        $selection  = 'daily site stats';
        $data       = $unifidata->stat_daily_site();
        break;
    case 'list_devices':
        $selection  = 'list devices';
        $data       = $unifidata->list_aps();
        break;
    case 'list_wlan_groups':
        $selection  = 'list wlan groups';
        $data       = $unifidata->list_wlan_groups();
        break;
    case 'stat_sessions':
        $selection  = 'stat sessions';
        $data       = $unifidata->stat_sessions();
        break;
    case 'list_users':
        $selection  = 'list users';
        $data       = $unifidata->list_users();
        break;
    case 'list_rogueaps':
        $selection  = 'list rogue access points';
        $data       = $unifidata->list_rogueaps();
        break;
    case 'list_events':
        $selection  = 'list events';
        $data       = $unifidata->list_events();
        break;
    case 'list_alarms':
        $selection  = 'list alerts';
        $data       = $unifidata->list_alarms();
        break;
    case 'list_wlanconf':
        $selection  = 'list wlan config';
        $data       = $unifidata->list_wlanconf();
        break;
    case 'list_health':
        $selection  = 'site health metrics';
        $data       = $unifidata->list_health();
        break;
    case 'list_dashboard':
        $selection  = 'site dashboard metrics';
        $data       = $unifidata->list_dashboard();
        break;
    case 'list_settings':
        $selection  = 'list site settings';
        $data       = $unifidata->list_settings();
        break;
    case 'list_sites':
        $selection  = 'details of available sites';
        $data       = $sites;
        break;
    case 'list_extension':
        $selection  = 'list VoIP extensions';
        $data       = $unifidata->list_extension();
        break;
    case 'list_portconf':
        $selection  = 'list port configuration';
        $data       = $unifidata->list_portconf();
        break;
    case 'list_networkconf':
        $selection  = 'list network configuration';
        $data       = $unifidata->list_networkconf();
        break;
    case 'list_dynamicdns':
        $selection  = 'dynamic dns configuration';
        $data       = $unifidata->list_dynamicdns();
        break;
    case 'list_portforwarding':
        $selection  = 'list port forwarding rules';
        $data       = $unifidata->list_portforwarding();
        break;
    case 'list_portforward_stats':
        $selection  = 'list port forwarding stats';
        $data       = $unifidata->list_portforward_stats();
        break;
    case 'stat_voucher':
        $selection  = 'list hotspot vouchers';
        $data       = $unifidata->stat_voucher();
        break;
    case 'stat_payment':
        $selection  = 'list hotspot payments';
        $data       = $unifidata->stat_payment();
        break;
    case 'list_hotspotop':
        $selection  = 'list hotspot operators';
        $data       = $unifidata->list_hotspotop();
        break;
    case 'list_self':
        $selection  = 'self';
        $data       = $unifidata->list_self();
        break;
    default:
        break;
}

/*
count the number of objects collected from the controller
*/
if($action!=''){
    $objects_count = count($data);
}

echo json_encode($data);

/*
log off from the Unifi controller API
*/
$logout_results = $unifidata->logout();





