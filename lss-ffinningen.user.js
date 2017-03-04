// ==UserScript==
// @name        Einsatzkategorien
// @namespace   Leitstellenspiel
// @include     http*://www.leitstellenspiel.de/*
// @version     0.2.5.3
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

//Wie lange das Script warten soll, bis es startet (notwendig um die korrekte Reihenfolge der Fahrzeuge zu ermitteln).
//Kann bei Bedarf erhöht werden, falls die falschen Fahrzeuge angeklickt werden
var timeout = 250;

//wie viele Feuerwachen wurden als Rettungswache ausgebaut?
var anz_rettungswache_ausbau = 3;

//wie viele Feuerwachen wurden als Wasserrettungswache ausgebaut?
var anz_wasserrettungswache_ausbau = 0;

//FEUERWEHR
var lf       = [0, 1, 6, 7, 8, 9, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37];
var dl       = [2];
var elw1     = [3];
var elw2     = [34];
var gwa      = [5, 48];
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
var rth      = [31];

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
var anz_onSite_gwa = 0;
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
var anz_onSite_rth = 0;
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
var anz_Driving_gwa = 0;
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
var anz_Driving_rth = 0;
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
    origInner = title.innerHTML;
    title.innerHTML = title.innerHTML.replace(/(<small>\s*.+\s*.+\s.+\s.+\s*<\/small>)/ig, '').replace(/(<small>\s*.+\s*<\/small>)/ig, '');
    var orig = title.innerText;
    title.innerHTML = origInner;
    var keyword = orig;

    if (keyword.match('Brandmeldeanlage') && veh_mission === null && veh_driving === null)
    {
        alertFhz(rtw, 2, 'RTW', false, 'RD');
    }

    keyword = keyword.replace(' (Brandmeldeanlage)','').trim();

    setTimeout(function(){
        var help;
        checkOnSiteVehicles();
        checkDrivingVehicles();

        if (keyword != 'Krankentransport')
        {
            RTW();
        }

        if (keyword == 'Krankentransport')
        {
            alertFhz(ktw, 1, 'KTW', false, 'RD');
        }
        //Rettungsdienst-Einsätze für ein RTW hier eintragen
        else if (keyword == 'Brandsicherheitswachdienst im Theater')
        {
            alertFhz(lf, 1, 'LF', false);
            alertFhz(rtw, 1, 'RTW', false);
        }
        else if(keyword == 'Herzinfarkt' ||
                keyword == 'Krampfanfall' ||
                keyword == 'Hitzschlag' ||
                keyword == 'Hitzekrampf' ||
                keyword == 'Unfall mit Motorsäge' ||
                keyword == 'Bewusstlose Person' ||
                keyword == 'Schwangere in Notsituation' ||
                keyword == 'Beginnende Geburt' ||
                keyword == 'Schädelverletzung' ||
                keyword == 'Herzrhythmusstörungen' ||
                keyword == 'Wirbelsäulenverletzung' ||
                keyword == 'akuter Asthma-Anfall' ||
                keyword == 'Bewusstloser Kranführer' ||
                keyword == 'Sturz aus Höhe' ||
                keyword == 'Verletzte Person auf Hochspannungsmast')
        {
            help = document.getElementById('mission_help').href;
            if(help.slice(-3) == 181)
            {
                alertFhz(rth, 1, 'RTH', false);
            }
            alertFhz(nef, 1, 'NEF', false);
        }
        else if(keyword == 'Hilflose Person')
        {
            alertFhz(fustw, 1, 'FuStW', false, 'POL');
            alertFhz(rtw, 1, 'rtw', false);
        }
        else if(keyword == 'Ladendiebstahl' ||
                keyword == 'Parkendes Auto gerammt' ||
                keyword == 'Metalldiebstahl' ||
                keyword == 'Taschendiebstahl' ||
                keyword == 'Notebook aus Schule entwendet' ||
                keyword == 'Personalienaufnahme von Schwarzfahrer' ||
                keyword == 'Einbruch in Keller' ||
                keyword == 'Sachbeschädigung' ||
                keyword == 'Angefahrene Person' ||
                keyword == 'Ruhestörung' ||
                keyword == 'Einbruch in Wohnung' ||
                keyword == 'Pannenfahrzeug' ||
                keyword == 'Hausfriedensbruch' ||
                keyword == 'Trunkenheitsfahrt' ||
                keyword == 'Trunkenheitsfahrt nach Silvesterparty' ||
                keyword == 'Ampelausfall' ||
                keyword == 'Verkehrsbehinderung' ||
                keyword == 'Diebstahl aus Kfz' ||
                keyword == 'Kfz durch Feuerwerkskörper beschädigt' ||
                keyword == 'Verstoß gegen Sprengstoffverordnung' ||
                keyword == 'Kürbisse geklaut' ||
                keyword == 'Süßigkeitendiebstahl' ||
                keyword == 'Fahrraddiebstahl' ||
                keyword == 'Wildunfall')
        {
            alertFhz(fustw, 1, 'FuStW', false, 'POL');
        }
        else if(keyword == 'Randalierende Person' ||
                keyword == 'Häusliche Gewalt' ||
                keyword == 'Absicherung Musikumzug' ||
                keyword == 'Verkehrsüberwachung')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
        }
        else if(keyword == 'Frankenstein gesichtet')
        {
            alertFhz(fustw, 3, 'FuStW', false, 'POL');
        }
        else if(keyword == 'Monster ausgebrochen')
        {
            alertFhz(fustw, 4, 'FuStW', false, 'POL');
        }
        else if(keyword == 'Suche nach Vermissten')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(ph, 1, 'PH', false);
            alertFhz(lf, 1, 'LF', false);
        }

        else if(keyword == 'Kabeldiebstahl')
        {
            alertFhz(fustw, 3, 'FuStW', false, 'POL');
            alertFhz(ph, 1, 'PH', false);
        }
        else if(keyword == 'LKW in Hauswand')
        {
            alertFhz(gkw, 1, 'GKW', false, 'THW');
            alertFhz(lf, 2, 'LF', false);
            alertFhz(dl, 1, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(mtwtz, 1, 'MTW-TZ', false);
            alertFhz(mlw5, 1, 'MLW-5', false);
            alertFhz(mzkw, 1, 'MzKW', false);
        }
        else if(keyword == 'Erdrutsch')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(gkw, 1, 'GKW', false, 'THW');
            alertFhz(mtwtz, 1, 'MTW-TZ', false);
            alertFhz(brmgr, 1, 'BRmG R', false);
            alertFhz(mlw5, 1, 'MLW-5', false);
            alertFhz(lkwk9, 1, 'LKW K 9', false);
        }
        else if(keyword == 'Gefahrgut-LKW verunglückt')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            help = document.getElementById('mission_help').href;
            if(help.slice(-3) == 178)
            {
                alertFhz(gkw, 1, 'GKW', false, 'THW');
                alertFhz(lkwk9, 1, 'LKW K 9', false);
                alertFhz(mlw5, 1, 'MLW-5', false);
                alertFhz(brmgr, 1, 'BRmG R', false);
            }
            alertFhz(lf, 3, 'LF', false, 'THL');
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(ruest, 1, 'RÜST', false);
            alertFhz(gwg, 1, 'GW-G', false);
        }
        else if(keyword == 'Eingestürztes Wohnhaus')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(gkw, 2, 'GKW', false, 'THW');
            alertFhz(mtwtz, 1, 'MTW-TZ', false);
            alertFhz(brmgr, 2, 'BRmG R', false);
            alertFhz(mzkw, 1, 'MzKW', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(mlw5, 1, 'MLW-5', false);
            alertFhz(lf, 3, 'LF', false);
            alertFhz(fwk, 1, 'FWK', false);
            alertFhz(ruest, 1, 'RÜST', false);
        }
        else if(keyword == 'Mülleimerbrand' ||
                keyword == 'Containerbrand' ||
                keyword == 'Brennender PKW' ||
                keyword == 'Brennender PKW durch Feuerwerkskörper' ||
                keyword == 'Motorrad-Brand' ||
                keyword == 'Brennendes Gras' ||
                keyword == 'Brennendes Laub' ||
                keyword == 'Brennende Hecke' ||
                keyword == 'Brennende Hecke durch Feuerwerkskörper' ||
                keyword == 'Sperrmüllbrand' ||
                keyword == 'Sperrmüllbrand durch Feuerwerkskörper' ||
                keyword == 'Strohballen Brand' ||
                keyword == 'Traktor Brand' ||
                keyword == 'Brennende Telefonzelle' ||
                keyword == 'Kleiner Waldbrand' ||
                keyword == 'Brand in Briefkasten' ||
                keyword == 'Brennendes Gebüsch' ||
                keyword == 'Brennender Anhänger' ||
                keyword == 'Fettbrand in Pommesbude' ||
                keyword == 'Brennendes Bus-Häuschen' ||
                keyword == 'Brennendes Bus-Häuschen durch Feuerwerkskörper' ||
                keyword == 'Brennender Adventskranz' ||
                keyword == 'Brennende Papiercontainer' ||
                keyword == 'Brennende Papiercontainer durch Feuerwerkskörper' ||
                keyword == 'Feuerprobealarm an Schule' ||
                keyword == 'Brennender Bollerwagen')
        {
            alertFhz(lf, 1, 'LF', false, 'B');
        }
        else if(keyword == 'Baum auf Straße' ||
                keyword == 'Kleintier in Not' ||
                keyword == 'Keller unter Wasser' ||
                keyword == 'Kleine Ölspur' ||
                keyword == 'Auslaufende Betriebsstoffe' ||
                keyword == 'Tiefgarage unter Wasser' ||
                keyword == 'Äste auf Fahrbahn' ||
                keyword == 'Umherfliegendes Baumaterial' ||
                keyword == 'Baum auf Dach' ||
                keyword == 'Straße unter Wasser' ||
                keyword == 'Baum auf Radweg')
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
        }
        else if(keyword == 'Straße unter Wasser') {
            alertFhz(lf, 1, 'LF', false, 'THL');
        }
        else if(keyword == 'Verletzte Person auf Baugerüst')
        {
            alertFhz(elw1, 1, 'ELW1', false, 'THL');
            alertFhz(gwh, 1, 'GW-H', false);
        }
        else if(keyword == 'Bewusstloser Kranführer')
        {
            alertFhz(elw1, 1, 'ELW1', false, 'THL');
            alertFhz(gwh, 1, 'GW-H', false);
            alertFhz(fustw, 1, 'FuStW', false);
        }
        else if(keyword == 'Fassadenteile drohen zu fallen')
        {
            alertFhz(elw1, 1, 'ELW1', false, 'THL');
            alertFhz(fustw, 1, 'FuStW', false);
        }
        else if(keyword == 'Person im Aufzug')
        {
            alertFhz(ruest, 1, 'RÜST', false, 'THL');
        }
        else if(keyword == 'Große Ölspur')
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
            alertFhz(oel, 1, 'GW-ÖL', false);
        }
        else if(keyword == 'Parkdeck voll Wasser gelaufen')
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
            alertFhz(oel, 1, 'GW-ÖL', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gws, 1, 'GW-S', false);
            alertFhz(fustw, 2, 'FuStW', false);
        }
        else if(keyword == 'Person unter Baum eingeklemmt' ||
                keyword == 'Reitunfall mit Pkw')
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
            alertFhz(fustw, 1, 'FuStW', false);
            alertFhz(nef, 1, 'NEF', false);
        }
        else if(keyword == 'Auffahrunfall' ||
                keyword == 'Person hinter Tür' ||
                keyword == 'Motorradunfall')
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
            alertFhz(fustw, 1, 'FuStW', false);
        }
        else if(keyword == 'Baum auf Gleisen')
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
        }
        else if(keyword == 'Baum auf PKW')
        {
            alertFhz(fustw, 1, 'FuStW', false, 'POL');
            alertFhz(lf, 1, 'LF', false, 'THL');
        }
        else if(keyword == 'Gartenlaubenbrand' ||
                keyword == 'Brennender LKW' ||
                keyword == 'Kleiner Feldbrand' ||
                keyword == 'Kleiner Feldbrand durch Feuerwerkskörper' ||
                keyword == 'Wohnwagenbrand' ||
                keyword == 'Küchenbrand' ||
                keyword == 'Garagenbrand' ||
                keyword == 'Mähdrescher Brand')
        {
            alertFhz(lf, 2, 'LF', false, 'B');
        }
        else if(keyword == 'Feuer auf Balkon' ||
                keyword == 'Feuer auf Balkon durch Feuerwerkskörper' ||
                keyword == 'Zimmerbrand')
        {
            alertFhz(lf, 2, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
        }
        else if(keyword == 'Schornsteinbrand' ||
                keyword == 'Kaminbrand')
        {
            alertFhz(lf, 2, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Beschädigter Dachbereich')
        {
            alertFhz(lf, 2, 'LF', false, 'THL');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(fustw, 1, 'FuStW', false);
        }
        else if(keyword == 'Verletzte Person auf Hochspannungsmast')
        {
            alertFhz(lf, 2, 'LF', false, 'THL');
            alertFhz(gwh, 1, 'GW-H', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(fustw, 1, 'FuStW', false);
        }
        else if(keyword == 'Brennende Trafostation')
        {
            alertFhz(lf, 2, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'LKW in Supermarkt')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(lf, 2, 'LF', false, 'THL');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(fwk, 1, 'FWK', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gkw, 1, 'GKW', false);
            alertFhz(mtwtz, 1, 'MTW-TZ', false);
            alertFhz(mlw5, 1, 'MLW-5', false);
            alertFhz(mzkw, 1, 'MzKW', false);
        }
        else if(keyword == 'Verkehrsunfall mit Linienbus')
        {
            help = document.getElementById('mission_help').href;
            if(help.slice(-3) == 238)
            {
                alertFhz(fustw, 2, 'FuStW', false, 'POL');
                alertFhz(lf, 2, 'LF', false, 'THL');
                alertFhz(ruest, 1, 'RÜST', false);
                alertFhz(elw1, 1, 'ELW1', false);
            }
            else if(help.slice(-3) == 239)
            {
                alertFhz(fustw, 4, 'FuStW', false, 'POL');
                alertFhz(lf, 5, 'LF', false, 'THL');
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 2, 'ELW1', false);
                alertFhz(oel, 1, 'GW-ÖL', false);
                alertFhz(fwk, 1, 'FWK', false);
            }
        }
        else if(keyword == 'LKW umgestürzt')
        {
            alertFhz(lf, 2, 'LF', false, 'THL');
            alertFhz(ruest, 1, 'RÜST', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Verkehrsunfall mit Zug')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(lf, 2, 'LF', false, 'THL');
            alertFhz(ruest, 1, 'RÜST', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Pfefferspray in Schule')
        {
            alertFhz(lf, 2, 'LF', false);
            alertFhz(fustw, 3, 'FuStW', false, 'POL');
        }
        else if(keyword == 'Feuer in Schnellrestaurant')
        {
            alertFhz(lf, 3, 'LF', false, 'B');
        }
        else if (keyword == 'Brandsicherheitswache bei Volksfest')
        {
            alertFhz(lf, 3, 'LF', false);
            alertFhz(fustw, 1, 'FuStW', false, 'POL');
        }
        else if(keyword == 'Großer Waldbrand ')
        {
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(gws, 1, 'GW-S', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Brand im Supermarkt')
        {
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(ruest, 1, 'RÜST', false);
        }
        else if(keyword == 'Baum auf Oberleitung')
        {
            alertFhz(lf, 3, 'LF', false, 'THL');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(ruest, 1, 'RÜST', false);
        }
        else if(keyword == 'Kellerbrand' ||
                keyword == 'Kellerbrand durch Feuerwerkskörper' ||
                keyword == 'Maschinenbrand')
        {
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Dachstuhlbrand' ||
                keyword == 'Feuer in Einfamilienhaus')
        {
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Rauchentwicklung in Museum')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gwa, 1, 'GW-A', false);

        }
        else if(keyword == 'Gasgeruch')
        {
            alertFhz(fustw, 1, 'FuStW', false, 'POL');
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);

        }
        else if(keyword == 'Kleinflugzeug abgestürzt')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(lf, 3, 'LF', false, 'THL');
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Aufgerissener Öltank')
        {
            alertFhz(lf, 3, 'LF', false, 'THL');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(oel, 1, 'GW-ÖL', false);
        }
        else if(keyword == 'LKW Auffahrunfall')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(lf, 3, 'LF', false, 'THL');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(ruest, 1, 'RÜST', false);
        }
        else if(keyword == 'Gefahrgut-LKW verunglückt ')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(lf, 3, 'LF', false, 'THL');
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(ruest, 1, 'RÜST', false);
            alertFhz(gwg, 1, 'GW-G', false);
        }
        else if(keyword == 'Mittlerer Feldbrand')
        {
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Großer Feldbrand')
        {
            alertFhz(lf, 5, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gws, 1, 'GW-S', false);
        }
        else if(keyword == 'Tankstellenbrand')
        {
            alertFhz(lf, 4, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(dl, 1, 'DL', false);
        }
        else if(keyword == 'Brand in Werkstatt ')
        {
            alertFhz(lf, 4, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(dl, 1, 'DL', false);
            alertFhz(gwm, 1, 'GW-M', false);
        }
        else if(keyword == 'Feuer im Krankenhaus' ||
                keyword == 'Scheunenbrand')
        {
            alertFhz(lf, 4, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Brennende Lok')
        {
            alertFhz(lf, 4, 'LF', false, 'B');
            alertFhz(gwa, 1, 'GW-A', false);
            alertFhz(ruest, 1, 'RÜST', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gws, 1, 'GW-S', false);
        }
        else if(keyword == 'Flächenbrand')
        {
            help = document.getElementById('mission_help').href;
            if(help.slice(-3) == 139)
                alertFhz(lf, 4, 'LF', false, 'B');
            else
                alertFhz(lf, 2, 'LF', false, 'B');
        }
        else if(keyword == 'Brennendes Reetdachhaus' ||
                keyword == 'Brennendes Reetdachhaus durch Feuerwerkskörper')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(lf, 5, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(gwa, 1, 'GW-A', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Brennender Bus')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(lf, 5, 'LF', false, 'B');
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(ruest, 1, 'RÜST', false);
        }
        else if(keyword == 'Großbrand')
        {
            alertFhz(lf, 6, 'LF', false, 'B');
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 2, 'ELW1', false);
            alertFhz(dl, 2, 'DL', false);
            alertFhz(gws, 1, 'GW-S', false);
            alertFhz(gwa, 1, 'GW-A', false);
        }
        else if(keyword == 'Bürobrand')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(lf, 6, 'LF', false, 'B');
            alertFhz(dl, 2, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gwa, 1, 'GW-A', false);
        }
        else if(keyword == 'Ausgedehnte Ölspur')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(lf, 6, 'LF', false, 'THL');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(oel, 1, 'GW-ÖL', false);
        }
        else if(keyword == 'Baumaschine umgestürzt')
        {
            if (anzahl_pol >= 3)
                alertFhz(fustw, 3, 'FuStW', false, 'POL');
            alertFhz(lf, 4, 'LF', false, 'THL');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(dl, 1, 'DL', false);
            alertFhz(ruest, 2, 'RÜST', false);
            alertFhz(oel, 1, 'GW-ÖL', false);
            alertFhz(fwk, 1, 'FWK', false);
        }
        else if(keyword == 'Chlorgasaustritt')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(lf, 7, 'LF', false, 'THL');
            alertFhz(gwa, 2, 'GW-A', false);
            alertFhz(elw1, 2, 'ELW1', false);
        }
        else if(keyword == 'Sporthallenbrand')
        {
            alertFhz(lf, 7, 'LF', false, 'B');
            alertFhz(dl, 2, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Leck in Chemikalientank')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(lf, 8, 'LF', false, 'B');
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gwa, 1, 'GW-A', false);
            alertFhz(gwm, 2, 'GW-M', false);
            alertFhz(gwg, 1, 'GW-G', false);
            alertFhz(dekonp, 1, 'DEKON-P', false);
            alertFhz(oel, 1, 'GW-ÖL', false);
            alertFhz(ruest, 2, 'RÜST', false);
        }
        else if(keyword == 'Feuer auf Bauernhof - Mittel')
        {
            alertFhz(fustw, 3, 'FuStW', false, 'POL');
            alertFhz(lf, 7, 'LF', false, 'B');
            alertFhz(gwa, 1, 'GW-A', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(dl, 2, 'DL', false);
            alertFhz(gws, 1, 'GW-S', false);
        }
        else if(keyword == 'Feuer auf Bauernhof - Groß')
        {
            alertFhz(fustw, 3, 'FuStW', false, 'POL');
            alertFhz(lf, 15, 'LF', false, 'B');
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 2, 'ELW1', false);
            alertFhz(dl, 4, 'DL', false);
            alertFhz(gws, 1, 'GW-S', false);
            alertFhz(gwa, 1, 'GW-A', false);
            alertFhz(gkw, 1, 'GKW', false);
            alertFhz(mtwtz, 1, 'MTW-TZ', false);
            alertFhz(brmgr, 1, 'BRmG R', false);
            alertFhz(mlw5, 1, 'MLW-5', false);
            alertFhz(mzkw, 1, 'MzKW', false);
            alertFhz(nef, 2, 'NEF', false);
        }
        else if(keyword == 'Brennender Güterwaggon')
        {
            alertFhz(lf, 4, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(dl, 2, 'DL', false);
            alertFhz(ruest, 2, 'RÜST', false);
        }
        else if(keyword == 'Großer Waldbrand')
        {
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(gws, 1, 'GW-S', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Großfeuer im Wald')
        {
            help = document.getElementById('mission_help').href;
            if(help.slice(-3) == 136)
            {
                alertFhz(fustw, 1, 'FuStW', false, 'POL');
            }
            else
            {
                alertFhz(fustw, 3, 'FuStW', false, 'POL');
            }
            alertFhz(lf, 10, 'LF', false, 'B');
            alertFhz(gwa, 1, 'GW-A', false);
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 2, 'ELW1', false);
            alertFhz(dl, 2, 'DL', false);
            alertFhz(ruest, 1, 'RÜST', false);
            alertFhz(gwg, 1, 'GW-G', false);
            alertFhz(gwm, 1, 'GW-M', false);
            alertFhz(dekonp, 1, 'DEKON-P', false);
        }
        else if(keyword == 'Beschädigter Kesselwagen')
        {
            alertFhz(fustw, 3, 'FuStW', false, 'POL');
            alertFhz(lf, 10, 'LF', false);
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 2, 'ELW1', false, 'THL');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(gws, 1, 'GW-S', false);
            alertFhz(gkw, 1, 'GKW', false);
        }
        else if(keyword == 'Gasexplosion')
        {
            alertFhz(fustw, 4, 'FuStW', false, 'POL');
            alertFhz(lf, 20, 'LF', false);
            alertFhz(elw2, 2, 'ELW2', false);
            alertFhz(elw1, 4, 'ELW1', false);
            alertFhz(dl, 2, 'DL', false);
            alertFhz(fwk, 1, 'FWK', false);
            alertFhz(ruest, 2, 'RÜST', false);
            alertFhz(gws, 2, 'GW-S', false);
            alertFhz(gwm, 2, 'GW-M', false);
            alertFhz(gwa, 2, 'GW-A', false);
            alertFhz(gkw, 1, 'GKW', false);
            alertFhz(mtwtz, 1, 'MTW-TZ', false);
            alertFhz(brmgr, 1, 'BRmG R', false);
            alertFhz(mlw5, 1, 'MLW-5', false);
            alertFhz(mzkw, 1, 'MzKW', false);
            alertFhz(lkwk9, 1, 'LKW K 9', false);
            alertFhz(anhdle, 1, 'Anh DLE', false);
        }
        else if(keyword == 'Feuer im Lagerraum')
        {
            alertFhz(lf, 2, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(dl, 1, 'DL', false);
        }
        else if(keyword == 'Lagerhallenbrand')
        {
            alertFhz(fustw, 2, 'FuStW', false, 'POL');
            alertFhz(gkw, 1, 'GKW', false);
            alertFhz(mtwtz, 1, 'MTW-TZ', false);
            alertFhz(brmgr, 1, 'BRmG R', false);
            alertFhz(mlw5, 1, 'MLW-5', false);
            alertFhz(lkwk9, 1, 'LKW K 9', false);
            alertFhz(anhdle, 1, 'Anh DLE', false);
            alertFhz(lf, 5, 'LF', false, 'B');
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 2, 'ELW1', false);
            alertFhz(dl, 2, 'DL', false);
            alertFhz(gws, 1, 'GW-S', false);
            alertFhz(gwm, 1, 'GW-M', false);
            alertFhz(gwa, 1, 'GW-A', false);
            alertFhz(gkw, 1, 'GKW', false);
        }
        else if(keyword == 'Verkehrsunfall')
        {
            help = document.getElementById('mission_help').href;
            if(help.slice(-3) == 124 || help.slice(-3) == 126)
            {
                alertFhz(lf, 2, 'LF', false, 'THL');
                alertFhz(ruest, 1, 'RÜST', false);
            }
            else
            {
                alertFhz(lf, 1, 'LF', false, 'THL');
            }
        }
        else
        {
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
        if (fhz_id > -1 && fhz_id !== null) {

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

            for (j=0;j<gwa.length;j++) {
                if (fhz_id == gwa[j]) {
                    anz_onSite_gwa++;
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

            for (j=0;j<rth.length;j++) {
                if (fhz_id == rth[j]) {
                    anz_onSite_rth++;
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

            for (j=0;j<gwa.length;j++) {
                if (fhz_id == gwa[j]) {
                    anz_Driving_gwa++;
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

            for (j=0;j<rth.length;j++) {
                if (fhz_id == rth[j]) {
                    anz_Driving_rth++;
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
                if (anzahl_fw >= 6)
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
            case "gw-a":
                if (anzahl_fw >= 5)
                    toAlarm = toAlarm - (anz_onSite_gwa + anz_Driving_gwa);
                else
                    toAlarm = 0;
                break;
            case "rüst":
                if (anzahl_fw >= 4)
                    toAlarm = toAlarm - (anz_onSite_ruest + anz_Driving_ruest);
                else
                    toAlarm = 0;
                break;
            case "gw-öl":
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
                    toAlarm = toAlarm - (anz_onSite_nef + anz_Driving_nef) - (anz_onSite_rth + anz_Driving_rth);
                else
                    toAlarm = 0;
                break;
            case "rth":
                toAlarm = toAlarm - (anz_onSite_rth + anz_Driving_rth);
                break;
            case "kdow-orgl":
                toAlarm = toAlarm - (anz_onSite_kdoworgl + anz_Driving_kdoworgl);
                break;
            case "lna":
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
            case "lkw k 9":
                toAlarm = toAlarm - (anz_onSite_lkwk9 + anz_Driving_lkwk9);
                break;
            case "brmg r":
                toAlarm = toAlarm - (anz_onSite_brmgr + anz_Driving_brmgr);
                break;
            case "anh dle":
                toAlarm = toAlarm - (anz_onSite_anhdle + anz_Driving_anhdle);
                break;
            case "mlw-5":
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
    var hlf_ruest = 0;
    var nef_rth = 0;

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
                        if((y >= 43 && y <=44) || (y >= 47 && y <=49) || y == 54 || y == 62 || y == 71)
                        {
                            var noZugfahrzeug = fahrzeug.children[1];
                            if (noZugfahrzeug.style.display == 'none')
                            {
                                if (fahrzeug.getAttribute("clicked") != 'yes')
                                {
                                    fahrzeug.click();
                                    fahrzeug.setAttribute("clicked", "yes");
                                    //and count how many are clicked
                                    checked++;
                                }
                            }
                        }
                        else
                        {
                            if (fahrzeug.getAttribute("clicked") != 'yes')
                            {
                                if(y == 30)
                                {
                                    hlf_ruest++;
                                }
                                if(y == 31)
                                {
                                    nef_rth++;
                                }
                                fahrzeug.click();
                                fahrzeug.setAttribute("clicked", "yes");
                                //and count how many are clicked
                                checked++;
                            }
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

                            if (fahrzeug2.getAttribute("clicked") != 'yes')
                            {
                                fahrzeug2.click();
                                fahrzeug2.setAttribute("clicked", "yes");
                                //and count how many are clicked
                                checked++;
                            }
                        }
                    }
                }
            }
            desc = desc_orig;
        }
    }

    switch(desc.toLowerCase()) {
        case "lf":
            anz_Driving_lf = anz_Driving_lf+checked;
            if (hlf_ruest>0)
                anz_Driving_ruest = anz_Driving_ruest+hlf_ruest;
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
        case "gw-a":
            anz_Driving_gwa = anz_Driving_gwa+checked;
            color = color_fw;
            break;
        case "rüst":
            anz_Driving_ruest = anz_Driving_ruest+checked;
            color = color_fw;
            break;
        case "gw-öl":
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
        case "rth":
            anz_Driving_rth = anz_Driving_rth+checked;
            if (nef_rth > 0)
                anz_Driving_nef = anz_Driving_nef+nef_rth;
            color = color_rd;
            break;
        case "kdow-orgl":
            anz_Driving_kdoworgl = anz_Driving_kdoworgl+checked;
            color = color_rd;
            break;
        case "lna":
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
        case "anh dle":
            anz_Driving_anhdle = anz_Driving_anhdle+checked;
            color = color_thw;
            break;
        case "mlw-5":
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

    if (toAlarm > 0)
        anzahl_fhz = anzahl_fhz + toAlarm;
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
    var count_lna = 0;
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
                            alertFhz(gwa, fhz[ab]-anz_Driving_gwa, 'GW-A', true);
                            break;
                        case "ELW1":
                            alertFhz(elw1, fhz[ab]-anz_Driving_elw1, 'ELW1', true);
                            break;
                        case "ELW2":
                            alertFhz(elw2, fhz[ab]-anz_Driving_elw2, 'ELW2', true);
                            break;
                        case "Schlauchwagen":
                            alertFhz(gws, fhz[ab]-anz_Driving_gws, 'GW-S', true);
                            break;
                        case "GW-Messtechnik":
                            alertFhz(gwm, fhz[ab]-anz_Driving_gwm, 'GW-M', true);
                            break;
                        case "GW-Gefahrgut":
                            alertFhz(gwg, fhz[ab]-anz_Driving_gwg, 'GW-G', true);
                            break;
                    }
                }
            }
        }
        if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigen einen LNA.')>=0 && (veh_driving !== null || veh_mission !== null)) {
            count_lna++;
        }
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
    if (count_lna > 0)
    {
        alertFhz(kdowlna, 1-anz_Driving_kdowlna, 'LNA', true);
        alertFhz(nef, 1-anz_Driving_nef, 'NEF', true);
    }
    if (count_nef > 0)
    {
        alertFhz(nef, count_nef-anz_Driving_nef, 'NEF', true);
    }
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
