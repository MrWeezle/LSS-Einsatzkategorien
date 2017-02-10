// ==UserScript==
// @name        Einsatzkategorien
// @namespace   Leitstellenspiel
// @include     http*://www.leitstellenspiel.de/*
// @version     0.2.2.2
// @author      FFInningen
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-idle
// ==/UserScript==


//Farben für die einzelnen Orgas
var color_fw       = 'red';
var color_thw      = 'blue';
var color_pol      = 'green';
var color_rd       = '#ff90a4';
var color_seg      = '#ff90a4';

//Wie lange das Script warten soll, bis es startet (notwendig um die korrekte Reihenfolge der Fahrzeuge zu ermitteln)
var timeout = 200;

//wie viele Feuerwachen wurden als Rettungswache ausgebaut?
var anz_rettungswache_ausbau = 1;

//wie viele Feuerwachen wurden als Wasserrettungswache ausgebaut?
var anz_wasserrettungswache_ausbau = 0;

//FEUERWEHR
var lf       = [0, 1, 6, 7, 8, 9, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37];
var dl       = [2];
var elw1     = [3];
var elw2     = [34];
var atem     = [5, 48];
var ruest    = [4, 30, 47];
var oel      = [10, 49];
var dekonp   = [53, 54];
var gwg      = [27];
var gwm      = [12];
var gws      = [11, 13, 14, 15, 16, 62];
var gwh      = [33];
var mtw      = [36];
var fwk      = [57];
//var gww      = [];
//var gwt      = [];


//RETTUNGSDIENST
var rtw      = [28];
var ktw      = [38, 58];
var nef      = [29, 31];
var kdoworgl = [56];
var kdowlna  = [55];

//POLIZEI
var fustw    = [32];
var lebefkw  = [35];
var grukw    = [50];
var gefkw    = [52];
var ph       = [61];
var kuekw    = [51];

//THW
var gkw      = [39];
var mzkw     = [41];
var mtwtz    = [40];
var lkwk9    = [42];
var brmgr    = [43];
var anhdle   = [44];
var mlw5     = [45];

//SEG
var gwsan    = [60];
var elw1seg  = [59];


/****************************************************************************************************************
*                                                                                                               *
*                                         AB HIER NICHTS MEHR ÄNDERN!!!                                         *
*                                                                                                               *
****************************************************************************************************************/

var anzahl_fw   = GM_getValue("anzahl_fw", anzahl_fw);
var anzahl_rd   = GM_getValue("anzahl_rd", anzahl_rd)+anz_rettungswache_ausbau;
var anzahl_thw  = GM_getValue("anzahl_thw", anzahl_thw);
var anzahl_pol  = GM_getValue("anzahl_pol", anzahl_pol);
var anzahl_bepo = GM_getValue("anzahl_bepo", anzahl_bepo);
var anzahl_seg  = GM_getValue("anzahl_seg", anzahl_seg);
var anzahl_wr   = GM_getValue("anzahl_wr", anzahl_wr)+anz_wasserrettungswache_ausbau;

var site_location = window.location.href;
if (site_location.slice(-1) == '#') {

    anzahl_fw   = 0;
    anzahl_rd   = 0;
    anzahl_thw  = 0;
    anzahl_pol  = 0;
    anzahl_bepo = 0;
    anzahl_seg  = 0;
    anzahl_wr   = 0;

    var building_list = document.getElementsByClassName('building_list_li');

    for(var i = 0; i < building_list.length; i++) {
        var building_id = building_list[i].getAttribute('building_type_id');
        if (building_id > -1) {
            switch(building_id) {
                case '0':
                    anzahl_fw++;
                    break;
                case '2':
                    anzahl_rd++;
                    break;
                case '6':
                    anzahl_pol++;
                    break;
                case '9':
                    anzahl_thw++;
                    break;
                case '11':
                    anzahl_bepo++;
                    break;
                case '12':
                    anzahl_seg++;
                    break;
                case '15':
                    anzahl_wr++;
                    break;
            }
        }
    }
    GM_setValue("anzahl_fw", anzahl_fw);
    GM_setValue("anzahl_rd", anzahl_rd);
    GM_setValue("anzahl_thw", anzahl_thw);
    GM_setValue("anzahl_pol", anzahl_pol);
    GM_setValue("anzahl_bepo", anzahl_bepo);
    GM_setValue("anzahl_seg", anzahl_seg);
    GM_setValue("anzahl_wr", anzahl_wr);
}

var anz_onSite_lf = 0;
var anz_onSite_dl = 0;
var anz_onSite_elw1 = 0;
var anz_onSite_elw2 = 0;
var anz_onSite_atem = 0;
var anz_onSite_ruest = 0;
var anz_onSite_oel = 0;
var anz_onSite_dekonp = 0;
var anz_onSite_gwg = 0;
var anz_onSite_gwm = 0;
var anz_onSite_gws = 0;
var anz_onSite_gwh = 0;
var anz_onSite_mtw = 0;
var anz_onSite_fwk = 0;
var anz_onSite_rtw = 0;
var anz_onSite_ktw = 0;
var anz_onSite_nef = 0;
var anz_onSite_kdoworgl = 0;
var anz_onSite_kdowlna = 0;
var anz_onSite_fustw = 0;
var anz_onSite_grukw = 0;
var anz_onSite_gefkw = 0;
var anz_onSite_ph = 0;
var anz_onSite_kuekw = 0;
var anz_onSite_gkw = 0;
var anz_onSite_mzkw = 0;
var anz_onSite_mtwtz = 0;
var anz_onSite_lkwk9 = 0;
var anz_onSite_brmgr = 0;
var anz_onSite_anhdle = 0;
var anz_onSite_mlw5 = 0;
var anz_onSite_gwsan = 0;
var anz_onSite_elw1seg = 0;

var anz_Driving_lf = 0;
var anz_Driving_dl = 0;
var anz_Driving_elw1 = 0;
var anz_Driving_elw2 = 0;
var anz_Driving_atem = 0;
var anz_Driving_ruest = 0;
var anz_Driving_oel = 0;
var anz_Driving_dekonp = 0;
var anz_Driving_gwg = 0;
var anz_Driving_gwm = 0;
var anz_Driving_gws = 0;
var anz_Driving_gwh = 0;
var anz_Driving_mtw = 0;
var anz_Driving_fwk = 0;
var anz_Driving_rtw = 0;
var anz_Driving_ktw = 0;
var anz_Driving_nef = 0;
var anz_Driving_kdoworgl = 0;
var anz_Driving_kdowlna = 0;
var anz_Driving_fustw = 0;
var anz_Driving_grukw = 0;
var anz_Driving_gefkw = 0;
var anz_Driving_ph = 0;
var anz_Driving_kuekw = 0;
var anz_Driving_gkw = 0;
var anz_Driving_mzkw = 0;
var anz_Driving_mtwtz = 0;
var anz_Driving_lkwk9 = 0;
var anz_Driving_brmgr = 0;
var anz_Driving_anhdle = 0;
var anz_Driving_mlw5 = 0;
var anz_Driving_gwsan = 0;
var anz_Driving_elw1seg = 0;

var anzahl_fhz     = 0;
var addedMissingFhzInformation = false;
var missingFhzText = '';

var veh_driving = document.getElementById('mission_vehicle_driving');
var veh_mission = document.getElementById('mission_vehicle_at_mission');
var additionalfhz = document.getElementsByClassName('alert alert-danger');

var aao_text = '';
var title = document.getElementById('missionH1');
if (title !== null) {
    var orig = title.innerHTML;
    var keyword = orig;

    setTimeout(function(){

        checkOnSiteVehicles();
        checkDrivingVehicles();

        if (keyword.match('Krankentransport'))
            alertFhz(ktw, 1, 'KTW', false, 'RD');
        else
            RTW();


        //Rettungsdienst-Einsätze für ein RTW hier eintragen
        if (keyword.match('Brandsicherheitswachdienst im Theater')) {
            alertFhz(rtw, 1, 'RTW', false);
        }

        if(keyword.match('Herzinfarkt')||
           keyword.match('Krampfanfall')||
           keyword.match('Unfall mit Motorsäge')||
           keyword.match('Bewusstlose Person')||
           keyword.match('Schwangere in Notsituation')||
           keyword.match('Beginnende Geburt')||
           keyword.match('Schädelverletzung')||
           keyword.match('akuter Asthma-Anfall'))
        {
            alertFhz(nef, 1, 'NEF', false);
        }

        if(keyword.match('Hilflose Person'))
        {
            alertFhz(fustw, 1, 'FuStW', false, 'POL');
            alertFhz(rtw, 1, 'rtw', false);
        }

        if(keyword.match('Ladendiebstahl')||
           keyword.match('Parkendes Auto gerammt')||
           keyword.match('Metalldiebstahl')||
           keyword.match('Taschendiebstahl')||
           keyword.match('Notebook aus Schule entwendet')||
           keyword.match('Personalienaufnahme von Schwarzfahrer')||
           keyword.match('Einbruch in Keller')||
           keyword.match('Sachbeschädigung')||
           keyword.match('Angefahrene Person')||
           keyword.match('Ruhestörung')||
           keyword.match('Einbruch in Wohnung')||
           keyword.match('Pannenfahrzeug')||
           keyword.match('Hausfriedensbruch')||
           keyword.match('Trunkenheitsfahrt')||
           keyword.match('Ampelausfall')||
           keyword.match('Verkehrsbehinderung')||
           keyword.match('Diebstahl aus Kfz')||
           keyword.match('Fahrraddiebstahl')||
           keyword.match('Wildunfall')||
           keyword.match('Trunkenheitsfahrt nach Silvesterparty'))
        {
            alertFhz(fustw, 1, 'FuStW', false, 'POL');
        }

        if(keyword.match('Randalierende Person')||
           keyword.match('Häusliche Gewalt'))
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
        }

        if(keyword.match('Suche nach Vermissten'))
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(ph, 1, 'PH', false);
            alertFhz(lf, 1, 'LF', false);
        }

        if(keyword.match('Kabeldiebstahl'))
        {
            alertFhz(fustw, 3, 'FuStW', false, 'POL');
            alertFhz(ph, 1, 'PH', false);
        }

        if(keyword.match('Mülleimerbrand')||
           keyword.match('Containerbrand')||
           keyword.match('Brennender PKW')||
           keyword.match('Motorrad-Brand')||
           keyword.match('Brennendes Gras')||
           keyword.match('Brennendes Laub')||
           keyword.match('Brennende Hecke')||
           keyword.match('Sperrmüllbrand')||
           keyword.match('Strohballen Brand')||
           keyword.match('Traktor Brand')||
           keyword.match('Brennende Telefonzelle')||
           keyword.match('Kleiner Waldbrand')||
           keyword.match('Brand in Briefkasten')||
           keyword.match('Brennendes Gebüsch')||
           keyword.match('Brennender Anhänger')||
           keyword.match('Fettbrand in Pommesbude')||
           keyword.match('Brennendes Bus-Häuschen')||
           keyword.match('Brennender Adventskranz')||
           keyword.match('Brennende Papiercontainer')||
           keyword.match('Person hinter Tür'))
        {
            alertFhz(lf, 1, 'LF', false, 'B');
        }

        if(keyword.match('Baum auf Straße')||
           keyword.match('Kleintier in Not')||
           keyword.match('Keller unter Wasser')||
           keyword.match('Kleine Ölspur')||
           keyword.match('Auslaufende Betriebsstoffe')||
           keyword.match('Tiefgarage unter Wasser')||
           keyword.match('Äste auf Fahrbahn')||
           keyword.match('Umherfliegendes Baumaterial')||
           keyword.match('Baum auf Dach')||
           keyword.match('Straße unter Wasser')||
           keyword.match('Baum auf Radweg'))
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
        }

        if(keyword.match('Straße unter Wasser')) {
            alertFhz(lf, 1, 'LF', false, 'THL');
        }

        if(keyword.match('Person im Aufzug'))
        {
            alertFhz(ruest, 1, 'RÜST', false, 'THL');
        }

        if(keyword.match('Große Ölspur'))
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
            alertFhz(oel, 1, 'ÖL', false);
        }

        if(keyword.match('Person unter Baum eingeklemmt')||
           keyword.match('Reitunfall mit Pkw'))
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
            alertFhz(fustw, 1, 'FuStW', false);
            alertFhz(nef, 1, 'NEF', false);
        }

        if(keyword.match('Verkehrsunfall')||
           keyword.match('Auffahrunfall')||
           keyword.match('Motorradunfall'))
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
            alertFhz(fustw, 1, 'FuStW', false);
        }

        if(keyword.match('Baum auf Gleisen')) {
            alertFhz(lf, 1, 'LF', false, 'THL');
        }

        if(keyword.match('Baum auf PKW'))
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
            alertFhz(fustw, 1, 'FuStW', false);
        }

        if(keyword.match('Gartenlaubenbrand')||
           keyword.match('Brennender LKW')||
           keyword.match('Kleiner Feldbrand')||
           keyword.match('Wohnwagenbrand')||
           keyword.match('Küchenbrand')||
           keyword.match('Garagenbrand')||
           keyword.match('Mähdrescher Brand')||
           keyword.match('Flächenbrand')||
           keyword.match('Kleiner Feldbrand durch Feuerwerkskörper')) {
            alertFhz(lf, 2, 'LF', false, 'B');
        }

        if(keyword.match('Feuer auf Balkon')||
           keyword.match('Feuer auf Balkon durch Feuerwerkskörper')||
           keyword.match('Zimmerbrand')) {
            alertFhz(lf, 2, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
        }

        if(keyword.match('Schornsteinbrand')||
           keyword.match('Kaminbrand')) {
            alertFhz(lf, 2, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }

        if(keyword.match('Brennende Trafostation')) {
            alertFhz(lf, 2, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
        }

        if(keyword.match('Verkehrsunfall mit Linienbus (klein)')) {
            alertFhz(lf, 2, 'LF', false, 'THL');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(fustw, 2, 'FuStW', false);
        }

        if(keyword.match('LKW umgestürzt')) {
            alertFhz(lf, 2, 'LF', false, 'THL');
            alertFhz(ruest, 1, 'RÜST', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }

        if(keyword.match('Verkehrsunfall mit Zug')) {
            alertFhz(lf, 2, 'LF', false, 'THL');
            alertFhz(ruest, 1, 'RÜST', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(fustw, 2, 'FuStW', false);
        }

        if(keyword.match('Pfefferspray in Schule')) {
            alertFhz(lf, 2, 'LF', false);
            alertFhz(fustw, 3, 'FuStW', false, 'POL');
        }

        if(keyword.match('Feuer in Schnellrestaurant')) {
            alertFhz(lf, 3, 'LF', false, 'B');

        }

        if(keyword.match('Großer Waldbrand ')) {
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(gws, 1, 'GW-S', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }

        if(keyword.match('Brand im Supermarkt')) {
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);

        }

        if(keyword.match('Kellerbrand')||
           keyword.match('Kellerbrand durch Feuerwerkskörper')||
           keyword.match('Maschinenbrand')) {
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
        }

        if(keyword.match('Dachstuhlbrand')||
           keyword.match('Feuer in Einfamilienhaus')) {
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }

        if(keyword.match('Rauchentwicklung in Museum')) {
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(atem, 1, 'ATEM', false);
            alertFhz(fustw, 2, 'FuStW', false);

        }
        if(keyword.match('Gasgeruch')) {
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(fustw, 1, 'FuStW', false);

        }

        if(keyword.match('Kleinflugzeug abgestürzt'))
        {
            alertFhz(lf, 3, 'LF', false, 'THL');
            alertFhz(elw1, 3, 'ELW1', false);
            alertFhz(fustw, 2, 'FuStW', false);
        }

        if(keyword.match('Aufgerissener Öltank'))
        {
            alertFhz(lf, 3, 'LF', false, 'THL');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(oel, 1, 'ÖL', false);
        }

        if(keyword.match('Mittlerer Feldbrand')) {
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gws, 1, 'GW-S', false);
        }

        if(keyword.match('Feuer im Krankenhaus')||
           keyword.match('Scheunenbrand')) {
            alertFhz(lf, 4, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }

        if(keyword.match('Brennende Lok')) {
            alertFhz(lf, 4, 'LF', false, 'B');
            alertFhz(atem, 1, 'ATEM', false);
            alertFhz(ruest, 1, 'RÜST', false);
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(gws, 1, 'GW-S', false);
        }

        /*if(keyword.match('Flächenbrand')) {
            alertFhz(lf, 4, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gws, 1, 'GW-S', false);
        }*/

        if(keyword.match('Verkehrsunfall mit Linienbus (groß)')) {
            alertFhz(lf, 5, 'LF', false, 'THL');
            alertFhz(elw1, 2, 'ELW1', false);
            alertFhz(oel, 1, 'ÖL', false);
            alertFhz(fustw, 4, 'FuStW', false);
        }

        if(keyword.match('Brennendes Reetdachhaus')) {
            alertFhz(lf, 5, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(gwa, 1, 'GW-A', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }

        if(keyword.match('Brennender Bus')) {
            alertFhz(lf, 5, 'LF', false, 'B');
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(ruest, 1, 'RÜST', false);
        }

        if(keyword.match('Bürobrand'))
        {
            alertFhz(lf, 6, 'LF', false, 'B');
            alertFhz(dl, 2, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(atem, 1, 'ATEM', false);
            alertFhz(fustw, 2, 'FuStW', false);
        }

        if(keyword.match('Ausgedehnte Ölspur ')) {
            alertFhz(lf, 6, 'LF', false, 'THL');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(oel, 1, 'ÖL', false);
        }

        if(keyword.match('Chlorgasaustritt')) {
            alertFhz(lf, 7, 'LF', false, 'THL');
            alertFhz(atem, 2, 'ATEM', false);
            alertFhz(elw1, 2, 'ELW1', false);
            alertFhz(fustw, 2, 'FuStW', false);
        }

        if(keyword.match('Feuer auf Bauernhof - Mittel')) {
            alertFhz(lf, 7, 'LF', false, 'B');
            alertFhz(atem, 1, 'ATEM', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(dl, 2, 'FuStW', false);
            alertFhz(gws, 1, 'GW-S', false);
        }

        additionalFHZ();
        displayAlertDate();
        displayNumAlertFhz();
        title.scrollIntoView();
        if (document.getElementById('amount_of_people') !== null)
            document.getElementById('amount_of_people').scrollIntoView();

        addMissingFhzInfo();
    }, timeout);
}

function checkOnSiteVehicles() {
    var matches = [];
    var searchEles = document.querySelectorAll("#mission_vehicle_at_mission > tbody > tr > td > a");
    for(var i = 0; i < searchEles.length; i++) {
        var found = false;
        var fhz_id = searchEles[i].getAttribute('vehicle_type_id');
        if (fhz_id > -1) {

            for (var j=0;j<lf.length;j++) {
                if (fhz_id == lf[j]) {
                    anz_onSite_lf++;
                    break;
                }
            }

            for (j=0;j<dl.length;j++) {
                if (fhz_id == dl[j]) {
                    anz_onSite_dl++;
                    break;
                }
            }

            for (j=0;j<elw1.length;j++) {
                if (fhz_id == elw1[j]) {
                    anz_onSite_elw1++;
                    break;
                }
            }

            for (j=0;j<elw2.length;j++) {
                if (fhz_id == elw2[j]) {
                    anz_onSite_elw2++;
                    anz_onSite_elw1++;
                    break;
                }
            }

            for (j=0;j<atem.length;j++) {
                if (fhz_id == atem[j]) {
                    anz_onSite_atem++;
                    break;
                }
            }

            for (j=0;j<ruest.length;j++) {
                if (fhz_id == ruest[j]) {
                    anz_onSite_ruest++;
                    break;
                }
            }

            for (j=0;j<oel.length;j++) {
                if (fhz_id == oel[j]) {
                    anz_onSite_oel++;
                    break;
                }
            }

            for (j=0;j<dekonp.length;j++) {
                if (fhz_id == dekonp[j]) {
                    anz_onSite_dekonp++;
                    break;
                }
            }

            for (j=0;j<gwg.length;j++) {
                if (fhz_id == gwg[j]) {
                    anz_onSite_gwg++;
                    break;
                }
            }

            for (j=0;j<gwm.length;j++) {
                if (fhz_id == gwm[j]) {
                    anz_onSite_gwm++;
                    break;
                }
            }

            for (j=0;j<gws.length;j++) {
                if (fhz_id == gws[j]) {
                    anz_onSite_gws++;
                    break;
                }
            }

            for (j=0;j<gwh.length;j++) {
                if (fhz_id == gwh[j]) {
                    anz_onSite_gwh++;
                    break;
                }
            }

            for (j=0;j<mtw.length;j++) {
                if (fhz_id == mtw[j]) {
                    anz_onSite_mtw++;
                    break;
                }
            }

            for (j=0;j<fwk.length;j++) {
                if (fhz_id == fwk[j]) {
                    anz_onSite_fwk++;
                    break;
                }
            }

            for (j=0;j<rtw.length;j++) {
                if (fhz_id == rtw[j]) {
                    anz_onSite_rtw++;
                    break;
                }
            }

            for (j=0;j<ktw.length;j++) {
                if (fhz_id == ktw[j]) {
                    anz_onSite_ktw++;
                    break;
                }
            }

            for (j=0;j<nef.length;j++) {
                if (fhz_id == nef[j]) {
                    anz_onSite_nef++;
                    break;
                }
            }

            for (j=0;j<kdoworgl.length;j++) {
                if (fhz_id == kdoworgl[j]) {
                    anz_onSite_kdoworgl++;
                    break;
                }
            }

            for (j=0;j<kdowlna.length;j++) {
                if (fhz_id == kdowlna[j]) {
                    anz_onSite_kdowlna++;
                    break;
                }
            }

            for (j=0;j<fustw.length;j++) {
                if (fhz_id == fustw[j]) {
                    anz_onSite_fustw++;
                    break;
                }
            }

            for (j=0;j<lebefkw.length;j++) {
                if (fhz_id == lebefkw[j]) {
                    anz_onSite_lebefkw++;
                    break;
                }
            }

            for (j=0;j<grukw.length;j++) {
                if (fhz_id == grukw[j]) {
                    anz_onSite_grukw++;
                    break;
                }
            }

            for (j=0;j<gefkw.length;j++) {
                if (fhz_id == gefkw[j]) {
                    anz_onSite_gefkw++;
                    break;
                }
            }

            for (j=0;j<ph.length;j++) {
                if (fhz_id == ph[j]) {
                    anz_onSite_ph++;
                    break;
                }
            }

            for (j=0;j<kuekw.length;j++) {
                if (fhz_id == kuekw[j]) {
                    anz_onSite_kuekw++;
                    break;
                }
            }

            for (j=0;j<gkw.length;j++) {
                if (fhz_id == gkw[j]) {
                    anz_onSite_gkw++;
                    break;
                }
            }

            for (j=0;j<mzkw.length;j++) {
                if (fhz_id == mzkw[j]) {
                    anz_onSite_mzkw++;
                    break;
                }
            }

            for (j=0;j<mtwtz.length;j++) {
                if (fhz_id == mtwtz[j]) {
                    anz_onSite_mtwtz++;
                    break;
                }
            }

            for (j=0;j<lkwk9.length;j++) {
                if (fhz_id == lkwk9[j]) {
                    anz_onSite_lkwk9++;
                    break;
                }
            }

            for (j=0;j<brmgr.length;j++) {
                if (fhz_id == brmgr[j]) {
                    anz_onSite_brmgr++;
                    break;
                }
            }

            for (j=0;j<anhdle.length;j++) {
                if (fhz_id == anhdle[j]) {
                    anz_onSite_anhdle++;
                    break;
                }
            }

            for (j=0;j<mlw5.length;j++) {
                if (fhz_id == mlw5[j]) {
                    anz_onSite_mlw5++;
                    break;
                }
            }

            for (j=0;j<gwsan.length;j++) {
                if (fhz_id == gwsan[j]) {
                    anz_onSite_gwsan++;
                    break;
                }
            }

            for (j=0;j<elw1seg.length;j++) {
                if (fhz_id == elw1seg[j]) {
                    anz_onSite_elw1seg++;
                    break;
                }
            }
        }
    }
}

function checkDrivingVehicles() {
    var matches = [];
    var searchEles = document.querySelectorAll("#mission_vehicle_driving > tbody > tr > td > a");
    for(var i = 0; i < searchEles.length; i++) {
        var found = false;
        var fhz_id = searchEles[i].getAttribute('vehicle_type_id');
        if (fhz_id !== null) {
            for (var j=0;j<lf.length;j++) {
                if (fhz_id == lf[j]) {
                    anz_Driving_lf++;
                    break;
                }
            }

            for (j=0;j<dl.length;j++) {
                if (fhz_id == dl[j]) {
                    anz_Driving_dl++;
                    break;
                }
            }

            for (j=0;j<elw1.length;j++) {
                if (fhz_id == elw1[j]) {
                    anz_Driving_elw1++;
                    break;
                }
            }
            for (j=0;j<elw2.length;j++) {
                if (fhz_id == elw2[j]) {
                    anz_Driving_elw2++;
                    anz_Driving_elw1++;
                    break;
                }
            }

            for (j=0;j<atem.length;j++) {
                if (fhz_id == atem[j]) {
                    anz_Driving_atem++;
                    break;
                }
            }

            for (j=0;j<ruest.length;j++) {
                if (fhz_id == ruest[j]) {
                    anz_Driving_ruest++;
                    break;
                }
            }

            for (j=0;j<oel.length;j++) {
                if (fhz_id == oel[j]) {
                    anz_Driving_oel++;
                    break;
                }
            }

            for (j=0;j<dekonp.length;j++) {
                if (fhz_id == dekonp[j]) {
                    anz_Driving_dekonp++;
                    break;
                }
            }

            for (j=0;j<gwg.length;j++) {
                if (fhz_id == gwg[j]) {
                    anz_Driving_gwg++;
                    break;
                }
            }

            for (j=0;j<gwm.length;j++) {
                if (fhz_id == gwm[j]) {
                    anz_Driving_gwm++;
                    break;
                }
            }

            for (j=0;j<gws.length;j++) {
                if (fhz_id == gws[j]) {
                    anz_Driving_gws++;
                    break;
                }
            }

            for (j=0;j<gwh.length;j++) {
                if (fhz_id == gwh[j]) {
                    anz_Driving_gwh++;
                    break;
                }
            }

            for (j=0;j<mtw.length;j++) {
                if (fhz_id == mtw[j]) {
                    anz_Driving_mtw++;
                    break;
                }
            }

            for (j=0;j<fwk.length;j++) {
                if (fhz_id == fwk[j]) {
                    anz_Driving_fwk++;
                    break;
                }
            }

            for (j=0;j<rtw.length;j++) {
                if (fhz_id == rtw[j]) {
                    anz_Driving_rtw++;
                    found=true;
                    break;
                }
            }

            for (j=0;j<ktw.length;j++) {
                if (fhz_id == ktw[j]) {
                    anz_Driving_ktw++;
                    break;
                }
            }

            for (j=0;j<nef.length;j++) {
                if (fhz_id == nef[j]) {
                    anz_Driving_nef++;
                    break;
                }
            }

            for (j=0;j<kdoworgl.length;j++) {
                if (fhz_id == kdoworgl[j]) {
                    anz_Driving_kdoworgl++;
                    break;
                }
            }

            for (j=0;j<kdowlna.length;j++) {
                if (fhz_id == kdowlna[j]) {
                    anz_Driving_kdowlna++;
                }
            }

            for (j=0;j<fustw.length;j++) {
                if (fhz_id == fustw[j]) {
                    anz_Driving_fustw++;
                    break;
                }
            }

            for (j=0;j<lebefkw.length;j++) {
                if (fhz_id == lebefkw[j]) {
                    anz_Driving_lebefkw++;
                    break;
                }
            }

            for (j=0;j<grukw.length;j++) {
                if (fhz_id == grukw[j]) {
                    anz_Driving_grukw++;
                    break;
                }
            }

            for (j=0;j<gefkw.length;j++) {
                if (fhz_id == gefkw[j]) {
                    anz_Driving_gefkw++;
                    break;
                }
            }

            for (j=0;j<ph.length;j++) {
                if (fhz_id == ph[j]) {
                    anz_Driving_ph++;
                    break;
                }
            }

            for (j=0;j<kuekw.length;j++) {
                if (fhz_id == kuekw[j]) {
                    anz_Driving_kuekw++;
                    break;
                }
            }

            for (j=0;j<gkw.length;j++) {
                if (fhz_id == gkw[j]) {
                    anz_Driving_gkw++;
                    break;
                }
            }

            for (j=0;j<mzkw.length;j++) {
                if (fhz_id == mzkw[j]) {
                    anz_Driving_mzkw++;
                    break;
                }
            }

            for (j=0;j<mtwtz.length;j++) {
                if (fhz_id == mtwtz[j]) {
                    anz_Driving_mtwtz++;
                    break;
                }
            }

            for (j=0;j<lkwk9.length;j++) {
                if (fhz_id == lkwk9[j]) {
                    anz_Driving_lkwk9++;
                    break;
                }
            }

            for (j=0;j<brmgr.length;j++) {
                if (fhz_id == brmgr[j]) {
                    anz_Driving_brmgr++;
                    break;
                }
            }

            for (j=0;j<anhdle.length;j++) {
                if (fhz_id == anhdle[j]) {
                    anz_Driving_anhdle++;
                    break;
                }
            }

            for (j=0;j<mlw5.length;j++) {
                if (fhz_id == mlw5[j]) {
                    anz_Driving_mlw5++;
                    break;
                }
            }

            for (j=0;j<gwsan.length;j++) {
                if (fhz_id == gwsan[j]) {
                    anz_Driving_gwsan++;
                    break;
                }
            }

            for (j=0;j<elw1seg.length;j++) {
                if (fhz_id == elw1seg[j]) {
                    anz_Driving_elw1seg++;
                    break;
                }
            }
        }
    }
}

function alertFhz(fhz, anzahl, desc, additional, aao_key) {
    var color;
    if (anzahl < 1)
        anzahl = 0;
    if (additional !== true)
        additional=false;
    var toAlarm = anzahl;
    var checked = 0;
    var anzahl_orig = anzahl;

    if (aao_key === null || typeof aao_key === 'undefined')
        aao_key = '';
    if (!additional) {
        switch(desc.toLowerCase()) {
            case "lf":
                toAlarm = toAlarm - (anz_onSite_lf + anz_Driving_lf);
                break;
            case "dl":
                if (anzahl_fw >= 3)
                    toAlarm = toAlarm - (anz_onSite_dl + anz_Driving_dl);
                else
                    toAlarm = 0;
                break;
            case "elw1":
                alert(anzahl_fw);
                if (anzahl_fw >= 5)
                    toAlarm = toAlarm - (anz_onSite_elw1 + anz_Driving_elw1) - (anz_onSite_elw2 + anz_Driving_elw2);
                else
                    toAlarm = 0;
                break;
            case "elw2":
                if (anzahl_fw >= 13)
                    toAlarm = toAlarm - (anz_onSite_elw2 + anz_Driving_elw2);
                else
                    toAlarm = 0;
                break;
            case "atem":
                if (anzahl_fw >= 5)
                    toAlarm = toAlarm - (anz_onSite_atem + anz_Driving_atem);
                else
                    toAlarm = 0;
                break;
            case "rüst":
                if (anzahl_fw >= 4)
                    toAlarm = toAlarm - (anz_onSite_ruest + anz_Driving_ruest);
                else
                    toAlarm = 0;
                break;
            case "öl":
                if (anzahl_fw >= 6)
                    toAlarm = toAlarm - (anz_onSite_oel + anz_Driving_oel);
                else
                    toAlarm = 0;
                break;
            case "dekon-p":
                if (anzahl_fw >= 14)
                    toAlarm = toAlarm - (anz_onSite_dekonp + anz_Driving_dekonp);
                else
                    toAlarm = 0;
                break;
            case "gw-g":
                if (anzahl_fw >= 11)
                    toAlarm = toAlarm - (anz_onSite_gwg + anz_Driving_gwg);
                else
                    toAlarm = 0;
                break;
            case "gw-m":
                if (anzahl_fw >= 10)
                    toAlarm = toAlarm - (anz_onSite_gwm + anz_Driving_gwm);
                else
                    toAlarm = 0;
                break;
            case "gw-s":
                if (anzahl_fw >= 7)
                    toAlarm = toAlarm - (anz_onSite_gws + anz_Driving_gws);
                else
                    toAlarm = 0;
                break;
            case "gw-h":
                if (anzahl_fw >= 12)
                    toAlarm = toAlarm - (anz_onSite_gwh + anz_Driving_gwh);
                else
                    toAlarm = 0;
                break;
            case "mtw":
                toAlarm = toAlarm - (anz_onSite_mtw + anz_Driving_mtw);
                break;
            case "fwk":
                if (anzahl_fw >= 14)
                    toAlarm = toAlarm - (anz_onSite_fwk + anz_Driving_fwk);
                else
                    toAlarm = 0;
                break;
            case "rtw":
                toAlarm = toAlarm - (anz_onSite_rtw + anz_Driving_rtw);
                break;
            case "ktw":
                toAlarm = toAlarm - (anz_onSite_ktw + anz_Driving_ktw);
                break;
            case "nef":
                if (anzahl_rd >= 3)
                    toAlarm = toAlarm - (anz_onSite_nef + anz_Driving_nef);
                else
                    toAlarm = 0;
                break;
            case "kdow-orgl":
                toAlarm = toAlarm - (anz_onSite_kdoworgl + anz_Driving_kdoworgl);
                break;
            case "kdow-lna":
                toAlarm = toAlarm - (anz_onSite_kdowlna + anz_Driving_kdowlna);
                break;
            case "fustw":
                toAlarm = toAlarm - (anz_onSite_fustw + anz_Driving_fustw);
                break;
            case "lebefkw":
                toAlarm = toAlarm - (anz_onSite_lebefkw + anz_Driving_lebefkw);
                break;
            case "grukw":
                toAlarm = toAlarm - (anz_onSite_grukw + anz_Driving_grukw);
                break;
            case "gefkw":
                toAlarm = toAlarm - (anz_onSite_gefkw + anz_Driving_gefkw);
                break;
            case "ph":
                toAlarm = toAlarm - (anz_onSite_ph + anz_Driving_ph);
                break;
            case "kuekw":
                toAlarm = toAlarm - (anz_onSite_kuekw + anz_Driving_kuekw);
                break;
            case "gkw":
                toAlarm = toAlarm - (anz_onSite_gkw + anz_Driving_gkw);
                break;
            case "mzkw":
                toAlarm = toAlarm - (anz_onSite_mzkw + anz_Driving_mzkw);
                break;
            case "mtw-tz":
                toAlarm = toAlarm - (anz_onSite_mtwtz + anz_Driving_mtwtz);
                break;
            case "lkw-k9":
                toAlarm = toAlarm - (anz_onSite_lkwk9 + anz_Driving_lkwk9);
                break;
            case "brmgr":
                toAlarm = toAlarm - (anz_onSite_brmgr + anz_Driving_brmgr);
                break;
            case "anhdle":
                toAlarm = toAlarm - (anz_onSite_anhdle + anz_Driving_anhdle);
                break;
            case "mlw5":
                toAlarm = toAlarm - (anz_onSite_mlw5 + anz_Driving_mlw5);
                break;
            case "gw-san":
                toAlarm = toAlarm - (anz_onSite_gwsan + anz_Driving_gwsan);
                break;
            case "elw1-seg":
                toAlarm = toAlarm - (anz_onSite_elw1seg + anz_Driving_elw1seg);
                break;
        }
    }
    var desc_orig;

    var x = document.getElementsByTagName('td');
    if (x !== null) {
        for (var i=0;i<x.length;i++) {
            //get vehicle_type_id attribute
            var y = x[i].getAttribute('vehicle_type_id');
            //check if element has the proper attribute
            if (y !== null) {
                //check the Vehicle array for the vehicle_type_id
                for (var j=0;j<fhz.length;j++) {
                    //if vehice is found
                    if (y == fhz[j] && checked < toAlarm) {
                        //click the vehicle
                        var fahrzeug = x[i].children[0];
                        //If AB is needed, check if a WLF is present
                        if((y >= 47 && y <=49) || y == 54 || y == 62 ||y == 71) {
                            var noWLF = fahrzeug.children[1];
                            if (noWLF.style.display == 'none') {
                                fahrzeug.click();
                                //and count how many are clicked
                                checked++;
                            }
                        }
                        else {
                            fahrzeug.click();
                            //and count how many are clicked
                            checked++;
                        }
                    }
                }
            }
        }
        if (checked === 0 && desc == 'ELW1'){
            desc_orig = desc;
            desc='ELW2';
            fhz = elw2;
            for (var k=0;k<x.length;k++) {
                //get vehicle_type_id attribute
                var z = x[k].getAttribute('vehicle_type_id');
                //check if element has the proper attribute
                if (z !== null) {
                    //check the Vehicle array for the vehicle_type_id
                    for (var l=0;l<fhz.length;l++) {
                        //if vehice is found
                        if (z == fhz[l] && checked < toAlarm) {
                            //click the vehicle
                            var fahrzeug2 = x[k].children[0];
                            fahrzeug2.click();
                            //and count how many are clicked
                            checked++;
                        }
                    }
                }
            }
        }
    }

    switch(desc.toLowerCase()) {
        case "lf":
            anz_Driving_lf = anz_Driving_lf+checked;
            color = color_fw;
            break;
        case "dl":
            anz_Driving_dl = anz_Driving_dl+checked;
            color = color_fw;
            break;
        case "elw1":
            anz_Driving_elw1 = anz_Driving_elw1+checked;
            color = color_fw;
            break;
        case "elw2":
            anz_Driving_elw2 = anz_Driving_elw2+checked;
            anz_Driving_elw1 = anz_Driving_elw1+checked;
            color = color_fw;
            break;
        case "atem":
            anz_Driving_atem = anz_Driving_atem+checked;
            color = color_fw;
            break;
        case "rüst":
            anz_Driving_ruest = anz_Driving_ruest+checked;
            color = color_fw;
            break;
        case "öl":
            anz_Driving_oel = anz_Driving_oel+checked;
            color = color_fw;
            break;
        case "dekon-p":
            anz_Driving_dekonp = anz_Driving_dekonp+checked;
            color = color_fw;
            break;
        case "gw-g":
            anz_Driving_gwg = anz_Driving_gwg+checked;
            color = color_fw;
            break;
        case "gw-m":
            anz_Driving_gwm = anz_Driving_gwm+checked;
            color = color_fw;
            break;
        case "gw-s":
            anz_Driving_gws = anz_Driving_gws+checked;
            color = color_fw;
            break;
        case "gw-h":
            anz_Driving_gwh = anz_Driving_gwh+checked;
            color = color_fw;
            break;
        case "mtw":
            anz_Driving_mtw = anz_Driving_mtw+checked;
            color = color_fw;
            break;
        case "fwk":
            anz_Driving_fwk = anz_Driving_fwk+checked;
            color = color_fw;
            break;
        case "rtw":
            anz_Driving_rtw = anz_Driving_rtw+checked;
            color = color_rd;
            break;
        case "ktw":
            anz_Driving_ktw = anz_Driving_ktw+checked;
            color = color_rd;
            break;
        case "nef":
            anz_Driving_nef = anz_Driving_nef+checked;
            color = color_rd;
            break;
        case "kdow-orgl":
            anz_Driving_kdoworgl = anz_Driving_kdoworgl+checked;
            color = color_rd;
            break;
        case "kdow-lna":
            anz_Driving_kdowlna = anz_Driving_kdowlna+checked;
            color = color_rd;
            break;
        case "fustw":
            anz_Driving_fustw = anz_Driving_fustw+checked;
            color = color_pol;
            break;
        case "lebefkw":
            anz_Driving_lebefkw = anz_Driving_lebefkw+checked;
            color = color_pol;
            break;
        case "grukw":
            anz_Driving_grukw = anz_Driving_grukw+checked;
            color = color_pol;
            break;
        case "gefkw":
            anz_Driving_gefkw = anz_Driving_gefkw+checked;
            color = color_pol;
            break;
        case "ph":
            anz_Driving_ph = anz_Driving_ph+checked;
            color = color_pol;
            break;
        case "kuekw":
            anz_Driving_kuekw = anz_Driving_kuekw+checked;
            color = color_pol;
            break;
        case "gkw":
            anz_Driving_gkw = anz_Driving_gkw+checked;
            color = color_thw;
            break;
        case "mzkw":
            anz_Driving_mzkw = anz_Driving_mzkw+checked;
            color = color_thw;
            break;
        case "mtw-tz":
            color = color_thw;
            anz_Driving_mtwtz = anz_Driving_mtwtz+checked;
            break;
        case "lkw-k9":
            anz_Driving_lkwk9 = anz_Driving_lkwk9+checked;
            color = color_thw;
            break;
        case "brmgr":
            anz_Driving_brmgr = anz_Driving_brmgr+checked;
            color = color_thw;
            break;
        case "anhdle":
            anz_Driving_anhdle = anz_Driving_anhdle+checked;
            color = color_thw;
            break;
        case "mlw5":
            anz_Driving_mlw5 = anz_Driving_mlw5+checked;
            color = color_thw;
            break;
        case "gw-san":
            anz_Driving_gwsan = anz_Driving_gwsan+checked;
            color = color_seg;
            break;
        case "elw1-seg":
            anz_Driving_elw1seg = anz_Driving_elw1seg+checked;
            color = color_seg;
            break;
    }
    if (checked < toAlarm) {
        missingFhzText = missingFhzText + ', '+(toAlarm-checked)+' '+desc;
        addedMissingFhzInformation = true;
    }

    anzahl_fhz = anzahl_fhz + checked;
    checked = 0;

    if (anzahl_orig > 0 && !additional && aao_key !== '')
        aao_text = '<font color='+color+'><b> '+aao_key+''+anzahl_orig+'</b></font>'+aao_text;
}

function RTW() {
    var patients = document.getElementsByClassName("patient_progress");
    var patients_anzahl = patients.length;
    var patient_progress = document.querySelectorAll('.progress-bar.progress-bar-danger:not(.progress-bar-striped)');
    var anzahl = 0;

    if (patients_anzahl > 0) {
        for (var i = 0;i<patients_anzahl;i++) {
            var width = $(patient_progress[i]).width();
            var parentWidth = $(patients).offsetParent().width();
            if (width == parentWidth) {
                anzahl++;
            }
        }
        if (patients_anzahl > 0)
            alertFhz(rtw, patients_anzahl, 'RTW',false,'RD');
    }
}

function additionalFHZ() {
    var count_rtw = 0;
    var count_nef = 0;
    for (var i = 0;i<additionalfhz.length;i++) {
        if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Zusätzlich benötigte Fahrzeuge:')>=0) {
            var additionalfhzInnerText = additionalfhz[i].innerText.replace(/\s\([a-zA-Z\s0-9]*\)/ig,'').replace('Zusätzlich benötigte Fahrzeuge: ','').replace(/[,]/ig,'').replace('ELW 1','ELW1').replace('ELW 2','ELW2');
            var fhz = additionalfhzInnerText.split(' ');
            for (var ab=0;ab<fhz.length;ab++) {
                if((ab % 2) === 0) {
                    var j;
                    switch(fhz[ab+1]) {
                        case "Drehleitern":
                            alertFhz(dl, fhz[ab]-anz_Driving_dl, 'DL', true);
                            break;
                            /*case "Löschfahrzeug":
                            alertFhz(lf, fhz[ab]-anz_Driving_lf, 'LF', true);
                            break;
                        case "Löschfahrzeuge":
                            alertFhz(lf, fhz[ab]-anz_Driving_lf, 'LF', true);
                            break;*/
                        case "FuStW":
                            alertFhz(fustw, fhz[ab]-anz_Driving_fustw, 'FuStW', true);
                            break;
                        case "GW-A":
                            alertFhz(atem, fhz[ab]-anz_Driving_atem, 'ATEM', true);
                            break;
                        case "ELW1":
                            alertFhz(elw1, fhz[ab]-anz_Driving_elw1, 'ELW1', true);
                            break;
                        case "ELW2":
                            alertFhz(elw2, fhz[ab]-anz_Driving_elw2, 'ELW2', true);
                            break;
                    }
                }
            }
        }
        /*if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigen einen RTW.')>=0 && (veh_driving !== null || veh_mission !== null)) {
            count_rtw++;
        }*/
        else if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigen ein NEF.')>=0 && (veh_driving !== null || veh_mission !== null)) {
            count_nef++;
        }

        else {
            var sprechwunsch = document.getElementsByClassName('btn btn-xs btn-success');
            if (sprechwunsch.length>0) {
                if (sprechwunsch[0].innerText.search('Ein Fahrzeug hat einen Sprechwunsch!'))
                    sprechwunsch[0].click();
            }
        }
    }
    if (count_rtw > 0)
        alertFhz(rtw, count_rtw, 'RTW', true);
    if (count_nef > 0)
        alertFhz(nef, count_nef-anz_Driving_nef, 'NEF', true);
}

function displayAlertDate() {
    var h1 = document.getElementById('missionH1');
    var einsatzdate = h1.getAttribute("data-original-title");
    h1.insertAdjacentHTML('beforeend', '<br><small>'+einsatzdate+' - Vor <span id="einsatzdate"></span></small>');
    //var bar = document.getElementsByClassName('progress');
    //bar[0].insertAdjacentHTML('beforebegin', aao_text);
    title.insertAdjacentHTML('afterbegin', aao_text);
    display_ct(einsatzdate);
}

function displayNumAlertFhz() {
    var fhz_selected = document.getElementsByClassName('badge vehicle_amount_selected');
    if (fhz_selected.length > 0) {
        fhz_selected[0].innerHTML = fhz_selected[0].innerHTML + '/'+anzahl_fhz;
    }
    anzahl_fhz = 0;
}

function addMissingFhzInfo() {
    if (addedMissingFhzInformation) {
        var aao_group = document.getElementById('mission-aao-group');
        aao_group.insertAdjacentHTML('beforeBegin', '<div class="alert alert-warning">Fehlende Fahrzeuge:<br>'+missingFhzText.substring(2, missingFhzText.length)+'</div>');
        addedMissingFhzInformation = false;
    }
}

function display_ct(date) {
    var a = date.replace(/[a-zA-Z]/ig,'').split(',');
    var b = a[1].split(':');
    var oldHour = b[0];
    var oldMin = b[1];

    var strcount;
    var x = new Date();
    var hour = x.getHours();
    var min = x.getMinutes();
    var newHour, newMin;

    newHour = hour-oldHour;

    if (oldMin > min) {
        newMin = (60 - oldMin) + min;
        newHour--;
    }
    else {
        newMin = min-oldMin;
    }

    if (newHour >= 1)
        newHour = newHour + 'h ';
    else
        newHour = '';

    if (newMin < 0)
        newMin = 0;
    if (document.getElementById('einsatzdate') !== null)
        document.getElementById('einsatzdate').innerHTML = newHour + newMin + ' min';
}
