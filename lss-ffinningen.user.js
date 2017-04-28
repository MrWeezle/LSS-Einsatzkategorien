// ==UserScript==
// @name        Einsatzkategorien
// @namespace   Leitstellenspiel
// @include     http*://www.leitstellenspiel.de/*
// @version     0.2.8.1
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
var color_wr      = 'blue';

//Wie lange das Script warten soll, bis es startet (notwendig um die korrekte Reihenfolge der Fahrzeuge zu ermitteln).
//Kann bei Bedarf erhöht werden, falls die falschen Fahrzeuge angeklickt werden
var timeout = 450;

//wie viele Feuerwachen wurden als Rettungswache ausgebaut?
var anz_rettungswache_ausbau = 3;

//wie viele Feuerwachen wurden als Wasserrettungswache ausgebaut?
var anz_wasserrettungswache_ausbau = 0;

var alertNef = true;
var addedRTW = false;
var seg_alerted = false;

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


//RETTUNGSDIENST
var rtw      = [28];
var ktw      = [38];
var nef      = [29];
var kdoworgl = [56];
var kdowlna  = [55];
var rth      = [31];

//POLIZEI
var fustw    = [32];
var lebefkw  = [35];
var grukw    = [50];
var gefkw    = [52];
var ph       = [61];
var fuekw    = [51];

//THW
var gkw      = [39];
var mzkw     = [41];
var mtwtz    = [40];
var lkwk9    = [42];
var brmgr    = [43];
var anhdle   = [44];
var mlw5     = [45];
var lkw7     = [65];

//SEG
var gwsan    = [60];
var elw1seg  = [59];
var ktwb     = [58];

//Wasserrettung
var gwt      = [63, 69];
var gww      = [64];
var boot     = [66, 67, 68, 70, 71];


/****************************************************************************************************************
*                                                                                                               *
*                                         AB HIER NICHTS MEHR ÄNDERN!!!                                         *
*                                                                                                               *
****************************************************************************************************************/

var anzahl_fw   = GM_getValue("anzahl_fw", anzahl_fw);
var anzahl_rd   = GM_getValue("anzahl_rd", anzahl_rd)+anz_rettungswache_ausbau;
var anzahl_rth  = GM_getValue("anzahl_rth", anzahl_rth);
var anzahl_thw  = GM_getValue("anzahl_thw", anzahl_thw);
var anzahl_pol  = GM_getValue("anzahl_pol", anzahl_pol);
var anzahl_ph   = GM_getValue("anzahl_ph", anzahl_ph);
var anzahl_bepo = GM_getValue("anzahl_bepo", anzahl_bepo);
var anzahl_seg  = GM_getValue("anzahl_seg", anzahl_seg);
var anzahl_wr   = GM_getValue("anzahl_wr", anzahl_wr)+anz_wasserrettungswache_ausbau;

var easteregg = document.querySelectorAll('a[href*=easteregg]');
if (easteregg.length == 1){
    easteregg[0].click();
}

var sprechwunsch = document.getElementsByClassName('btn btn-xs btn-success');
if (sprechwunsch.length>0) {
    if (sprechwunsch[0].innerText.match('Sprechwunsch bearbeiten'))
        sprechwunsch[0].click();
}

var next_sprechwunsch = document.getElementsByClassName('btn btn-success');
var next_clicked = false;
for (var i = 0;i<next_sprechwunsch.length;i++)
{
    if (next_sprechwunsch.length > 0 && next_sprechwunsch[i].innerText.match('Zum nächsten Fahrzeug im Status 5')) {
        next_sprechwunsch[i].click();
        next_clicked = true;
    }
}
for (var i = 0;i<next_sprechwunsch.length;i++)
{
    if (next_sprechwunsch.length > 0 && next_sprechwunsch[i].innerText.match('Zurück zum Einsatz') && !next_clicked) {
        next_sprechwunsch[i].click();
    }
}

var site_location = window.location.href;
if (site_location.slice(-1) == '#' || site_location.slice(-3) == '.de') {

    var building_list = document.getElementsByClassName('building_list_li');

    for(var i = 0; i < building_list.length; i++) {
        if (i===0)
        {
            anzahl_fw   = 0;
            anzahl_rd   = 0;
            anzahl_rth  = 0;
            anzahl_thw  = 0;
            anzahl_pol  = 0;
            anzahl_ph   = 0;
            anzahl_bepo = 0;
            anzahl_seg  = 0;
            anzahl_wr   = 0;
        }
        var building_id = building_list[i].getAttribute('building_type_id');
        if (building_id > -1) {
            switch(building_id) {
                case '0':
                    anzahl_fw++;
                    break;
                case '2':
                    anzahl_rd++;
                    break;
                case '5':
                    anzahl_rth++;
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
                case '13':
                    anzahl_ph++;
                    break;
                case '15':
                    anzahl_wr++;
                    break;
            }
        }
    }
    GM_setValue("anzahl_fw", anzahl_fw);
    GM_setValue("anzahl_rd", anzahl_rd);
    GM_setValue("anzahl_rth", anzahl_rth);
    GM_setValue("anzahl_thw", anzahl_thw);
    GM_setValue("anzahl_pol", anzahl_pol);
    GM_setValue("anzahl_ph", anzahl_ph);
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
var anz_onSite_lebefkw = 0;
var anz_onSite_gefkw = 0;
var anz_onSite_ph = 0;
var anz_onSite_fuekw = 0;
var anz_onSite_gkw = 0;
var anz_onSite_mzkw = 0;
var anz_onSite_mtwtz = 0;
var anz_onSite_lkwk9 = 0;
var anz_onSite_lkw7 = 0;
var anz_onSite_brmgr = 0;
var anz_onSite_anhdle = 0;
var anz_onSite_mlw5 = 0;
var anz_onSite_gwsan = 0;
var anz_onSite_elw1seg = 0;
var anz_onSite_ktwb = 0;
var anz_onSite_gwt = 0;
var anz_onSite_gww = 0;
var anz_onSite_boot = 0;

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
var anz_Driving_lebefkw = 0;
var anz_Driving_gefkw = 0;
var anz_Driving_ph = 0;
var anz_Driving_fuekw = 0;
var anz_Driving_gkw = 0;
var anz_Driving_mzkw = 0;
var anz_Driving_mtwtz = 0;
var anz_Driving_lkwk9 = 0;
var anz_Driving_lkw7 = 0;
var anz_Driving_brmgr = 0;
var anz_Driving_anhdle = 0;
var anz_Driving_mlw5 = 0;
var anz_Driving_gwsan = 0;
var anz_Driving_elw1seg = 0;
var anz_Driving_ktwb = 0;
var anz_Driving_gwt = 0;
var anz_Driving_gww = 0;
var anz_Driving_boot = 0;

var anzahl_fhz     = 0;
var addedMissingFhzInformation = false;
var missingFhzText = '';

var veh_driving = document.getElementById('mission_vehicle_driving');
var veh_mission = document.getElementById('mission_vehicle_at_mission');
var additionalfhz = document.getElementsByClassName('alert alert-danger');

var aao_text = '';
var keyword = '';
var title_orig = document.getElementById('missionH1');

var title = title_orig;

if (title !== null) {
    origInner = title.innerHTML;
    title.innerHTML = title.innerHTML.replace(/(<small>\s*.+\s*.+\s.+\s.+\s*<\/small>)/ig, '').replace(/(<small>\s*.+\s*<\/small>)/ig, '');
    var orig = title.innerText;
    title.innerHTML = origInner;
    keyword = orig;

    keyword = keyword.replace(' (Brandmeldeanlage)','').trim();

    setTimeout(function(){
        var help = document.getElementById('mission_help').href;

        checkOnSiteVehicles();
        checkDrivingVehicles();

        if (keyword != 'Krankentransport')
        {
            RTW(keyword);
        }

        if (keyword == 'Krankentransport')
        {
            alertFhz(ktw, 1, 'KTW', false, 'RD');
        }
        else if(keyword == 'Dorf/Stadtfest')
        {
            alertFhz(lf, 3, 'LF', false);
            alertFhz(gwsan, 1, 'GW-SAN', false);
            alertFhz(ktwb, 3, 'KTW-B', false);
        }
        else if(keyword == 'Volkslauf')
        {
            alertFhz(gwsan, 1, 'GW-SAN', false, 'RD');
            alertFhz(ktwb, 3, 'KTW-B', false);
            if(3-(anz_Driving_ktwb+anz_onSite_ktwb)>0)
                alertFhz(rtw, 3-(anz_Driving_ktwb+anz_onSite_ktwb), 'RTW', false);
        }
        else if(keyword == 'Entschärfung von Weltkriegsbombe')
        {
            alertFhz(lf, 10, 'LF', false);
            alertFhz(fustw, 5, 'FuStW', false);
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Schwerpunkteinsatz Tageswohnungseinbrüche')
        {
            alertFhz(lebefkw, 1, 'leBefKw', false, 'BePo');
            alertFhz(grukw, 3, 'GruKW', false);
        }
        else if(keyword == 'Schwerpunkteinsatz Verkehrsüberwachung')
        {
            alertFhz(lebefkw, 1, 'leBefKw', false, 'BePo');
            alertFhz(grukw, 3, 'GruKW', false);
        }
        else if(keyword == 'Präsenzeinsatz Volksfest')
        {
            alertFhz(lebefkw, 1, 'leBefKw', false, 'BePo');
            alertFhz(grukw, 3, 'GruKW', false);
        }
        else if(keyword == 'Jugendschutzkontrolle in Diskothek')
        {
            alertFhz(lebefkw, 1, 'leBefKw', false, 'BePo');
            alertFhz(grukw, 3, 'GruKW', false);
            alertFhz(fustw, 2, 'FuStW', false);
        }
        else if(keyword == 'Geländedurchsuchung nach Beweismittel')
        {
            alertFhz(lebefkw, 1, 'leBefKw', false, 'BePo');
            alertFhz(grukw, 3, 'GruKW', false);
        }
        else if(keyword == 'Geplante Razzia')
        {
            alertFhz(lebefkw, 2, 'leBefKw', false, 'BePo');
            alertFhz(grukw, 6, 'GruKW', false);
            alertFhz(gefkw, 1, 'GefKW', false);
            alertFhz(fustw, 2, 'FuStW', false);
        }
        else if(keyword == 'Fußball Bundesliga-Spiel' ||
                keyword == 'Hasentreffen in Ostereistedt')
        {
            alertFhz(lebefkw, 3, 'leBefKw', false, 'BePo');
            alertFhz(grukw, 9, 'GruKW', false);
            alertFhz(gefkw, 1, 'GefKW', false);
            alertFhz(fuekw, 1, 'FüKW', false);
            alertFhz(fustw, 2, 'FuStW', false);
            if(help.slice(-3) == 291)
            {
                alertFhz(rtw, 4, 'RTW', false);
                alertFhz(fustw, 2, 'FuStW', false);
                alertFhz(lf, 2, 'LF', false);
            }
        }
        else if(keyword == 'Angemeldete Demonstration')
        {
            alertFhz(grukw, 6, 'GruKW', false);
            alertFhz(lebefkw, 2, 'leBefKw', false, 'BePo');
            alertFhz(fustw, 3, 'FuStW', false);
            alertFhz(fuekw, 1, 'FüKW', false);
            alertFhz(rtw, 1, 'RTW', false);
        }
        else if(keyword == 'Brandsicherheitswachdienst im Theater')
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
                keyword == 'akuter Asthma-Anfall' ||
                keyword == 'Fieber' ||
                keyword == 'Schlaganfall' ||
                keyword == 'Bluthockdruck' ||
                keyword == 'Motorradunfall' ||
                keyword == 'Vaginale Blutung')
        {
            alertFhz(nef, 1, 'NEF', false);
        }
        else if(keyword == 'Sturz aus Höhe' ||
                keyword == 'Wirbelsäulenverletzung')
        {
            if((help.slice(-3) == 180 || help.slice(-3) == 181) && anzahl_rth > 0)
            {
                alertFhz(rth, 1, 'RTH', false);
            }
            else
                alertFhz(nef, 1, 'NEF', false);
        }
        else if(keyword == 'Verletzte Person auf Hochspannungsmast')
        {
            alertFhz(lf, 2, 'LF', false, 'THL');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(rtw, 1, 'RTW', false);
            alertFhz(gwh, 1, 'GW-H', false);
            alertFhz(fustw, 1, 'FuStW', false);
            if(help.slice(-3) == 236)
            {
                alertFhz(rth, 1, 'RTH', false);
            }
            else
            {
                alertFhz(nef, 1, 'NEF', false);
            }
        }
        else if(keyword == 'Hilflose Person')
        {
            alertFhz(fustw, 1, 'FuStW', false, 'POL');
            alertFhz(rtw, 1, 'rtw', false);
        }
        else if(keyword == 'Raub' ||
                keyword == 'Schlägerei')
        {
            alertFhz(fustw, 3, 'FuStW', false, 'POL');
        }
        else if(keyword == 'Massenschlägerei')
        {
            alertFhz(fustw, 5, 'FuStW', false, 'POL');
        }
        else if(keyword == 'Entflohener Gefangener')
        {
            alertFhz(fustw, 10, 'FuStW', false, 'POL');
            alertFhz(ph, 1, 'PH', false);
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
                keyword == 'Personenkontrolle' ||
                keyword == 'Wildunfall' ||
                keyword == 'Ostereier-Dieb' ||
                keyword == 'Pinsel aus Werkstatt entwendet' ||
                keyword == 'Angefahrener Osterhase' ||
                keyword == 'Tankbetrug')
        {
            alertFhz(fustw, 1, 'FuStW', false, 'POL');
        }
        else if(keyword == 'Angefahrender Osterhase')
        {
            alertFhz(fustw, 1, 'FuStW', false, 'POL');
            alertFhz(rtw, 1, 'RTW', false);
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
            alertFhz(fwk, 1, 'FwK', false);
        }
        else if(keyword == 'Erdrutsch' ||
                keyword == 'Eingestürzter Hasenbau')
        {
            alertFhz(fustw, 2, 'FuStW', false);
            alertFhz(gkw, 1, 'GKW', false, 'THW');
            alertFhz(mtwtz, 1, 'MTW-TZ', false);
            alertFhz(brmgr, 1, 'BRmG R', false);
            alertFhz(mlw5, 1, 'MLW-5', false);
            alertFhz(lkwk9, 1, 'LKW K 9', false);
        }
        else if(keyword == 'Gefahrgut-LKW verunglückt')
        {
            alertFhz(fustw, 2, 'FuStW', false);
            if(help.slice(-3) == 178)
            {
                alertFhz(gkw, 1, 'GKW', false);
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
            alertFhz(fustw, 2, 'FuStW', false);
            alertFhz(gkw, 2, 'GKW', false, 'THW');
            alertFhz(mtwtz, 1, 'MTW-TZ', false);
            alertFhz(brmgr, 2, 'BRmG R', false);
            alertFhz(mzkw, 1, 'MzKW', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(mlw5, 1, 'MLW-5', false);
            alertFhz(lf, 3, 'LF', false);
            alertFhz(fwk, 1, 'FwK', false);
            alertFhz(dl, 1, 'DL', false);
            alertFhz(ruest, 1, 'RÜST', false);
        }
        else if(keyword == 'Mülleimerbrand' ||
                keyword == 'Containerbrand' ||
                keyword == 'Brennender PKW' ||
                keyword == 'Brennender PKW durch Feuerwerkskörper' ||
                keyword == 'Motorrad-Brand' ||
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
                keyword == 'Brennender Bollerwagen' ||
                keyword == 'Brennendes Osternest')
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
                keyword == 'Baum auf Radweg' ||
                keyword == 'Schokoladenspur auf Strasse')
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
        }
        else if(keyword == 'Straße unter Wasser') {
            alertFhz(lf, 1, 'LF', false, 'THL');
            if(help.slice(-3) == 173)
            {
                alertFhz(fustw, 2, 'FuStW', false);
            }
        }
        else if(keyword == 'Verletzte Person auf Baugerüst')
        {
            alertFhz(elw1, 1, 'ELW1', false, 'THL');
            alertFhz(lf, 1, 'LF', false);
            alertFhz(rtw, 1, 'RTW', false);
            alertFhz(gwh, 1, 'GW-H', false);
            alertFhz(dl, 1, 'DL', false);
        }
        else if(keyword == 'Bewusstloser Kranführer')
        {
            alertFhz(nef, 1, 'NEF', false, 'RD');
            alertFhz(lf, 1, 'LF', false, 'THL');
            alertFhz(rtw, 1, 'RTW', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gwh, 1, 'GW-H', false);
            alertFhz(fustw, 1, 'FuStW', false);
        }
        else if(keyword == 'Fassadenteile drohen zu fallen')
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(fustw, 1, 'FuStW', false);
            alertFhz(dl, 1, 'DL', false);
            alertFhz(gwh, 1, 'GW-H', false);
        }
        else if(keyword == 'Person im Aufzug')
        {
            alertFhz(ruest, 1, 'RÜST', false, 'THL');
            alertFhz(rtw, 1, 'RTW', false);
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
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(gws, 1, 'GW-S', false);
            alertFhz(fustw, 2, 'FuStW', false);
            if(help.slice(-3) == 171)
            {
                alertFhz(fustw, 2, 'FuStW', false);
            }
        }
        else if(keyword == 'Person unter Baum eingeklemmt' ||
                keyword == 'Reitunfall mit Pkw')
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
            alertFhz(fustw, 1, 'FuStW', false);
            alertFhz(nef, 1, 'NEF', false);
            if(anz_Driving_rtw < 1 && anz_onSite_rtw < 1)
                alertFhz(rtw, 1, 'RTW', false);
        }
        else if(keyword == 'Auffahrunfall')
        {
            alertFhz(fustw, 1, 'FuStW', false);
        }
        else if(keyword == 'Person hinter Tür' ||
                keyword == 'Motorradunfall')
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
            alertFhz(rtw, 1, 'RTW', false);
            alertFhz(fustw, 1, 'FuStW', false);
        }
        else if(keyword == 'Baum auf Gleisen')
        {
            alertFhz(lf, 1, 'LF', false, 'THL');
            alertFhz(fustw, 1, 'FuStW', false);
        }
        else if(keyword == 'Baum auf PKW')
        {
            alertFhz(fustw, 1, 'FuStW', false);
            alertFhz(lf, 1, 'LF', false, 'THL');
        }
        else if(keyword == 'Gartenlaubenbrand' ||
                keyword == 'Brennender LKW' ||
                keyword == 'Kleiner Feldbrand' ||
                keyword == 'Kleiner Feldbrand durch Feuerwerkskörper' ||
                keyword == 'Wohnwagenbrand' ||
                keyword == 'Küchenbrand' ||
                keyword == 'Garagenbrand' ||
                keyword == 'Mähdrescher Brand' ||
                keyword == 'Brennendes Gras' ||
                keyword == 'Eierkocherbrand')
        {
            alertFhz(lf, 2, 'LF', false, 'B');
        }
        else if(keyword == 'Geplatzte Wasserleitung')
        {
            alertFhz(lf, 2, 'LF', false, 'THL');
        }
        else if(keyword == 'Feuer auf Balkon' ||
                keyword == 'Feuer auf Balkon durch Feuerwerkskörper' ||
                keyword == 'Zimmerbrand')
        {
            alertFhz(lf, 2, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
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
            if(help.slice(-3) == 193)
                alertFhz(fustw, 1, 'FuStW', false);
        }
        else if(keyword == 'LKW in Supermarkt')
        {
            alertFhz(fustw, 2, 'FuStW', false);
            alertFhz(lf, 2, 'LF', false, 'THL');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(fwk, 1, 'FwK', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gkw, 1, 'GKW', false);
            alertFhz(mtwtz, 1, 'MTW-TZ', false);
            alertFhz(mlw5, 1, 'MLW-5', false);
            alertFhz(mzkw, 1, 'MzKW', false);
        }
        else if(keyword == 'Verkehrsunfall mit Linienbus')
        {
            if(help.slice(-3) == 238)
            {
                alertFhz(fustw, 2, 'FuStW', false);
                alertFhz(lf, 2, 'LF', false, 'THL');
                alertFhz(ruest, 1, 'RÜST', false);
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 1, 'ELW1', false);
            }
            else if(help.slice(-3) == 239)
            {
                alertFhz(fustw, 4, 'FuStW', false);
                alertFhz(lf, 5, 'LF', false, 'THL');
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 2, 'ELW1', false);
                alertFhz(oel, 1, 'GW-ÖL', false);
                alertFhz(fwk, 1, 'FwK', false);
                alertFhz(kdowlna, 1, 'LNA', false);
            }
        }
        else if(keyword == 'LKW umgestürzt')
        {
            if(help.slice(-3) == 121)
            {
                alertFhz(fustw, 2, 'FuStW', false);
            }
            alertFhz(lf, 2, 'LF', false, 'THL');
            alertFhz(ruest, 1, 'RÜST', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(fwk, 1, 'FwK', false);
        }
        else if(keyword == 'Verkehrsunfall mit Zug')
        {
            alertFhz(fustw, 2, 'FuStW', false);
            alertFhz(lf, 2, 'LF', false, 'THL');
            alertFhz(ruest, 1, 'RÜST', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Verkehrsunfall mit Linienbus')
        {
            if(help.slice(-3) == 238)
            {
                alertFhz(fustw, 2, 'FuStW', false);
                alertFhz(lf, 2, 'LF', false, 'THL');
                alertFhz(ruest, 1, 'RÜST', false);
                alertFhz(elw1, 1, 'ELW1', false);
            }
            else if(help.slice(-3) == 239)
            {
                alertFhz(fustw, 4, 'FuStW', false);
                alertFhz(lf, 5, 'LF', false, 'THL');
                alertFhz(ruest, 2, 'RÜST', false);
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 2, 'ELW1', false);
                alertFhz(oel, 1, 'GW-ÖL', false);
                alertFhz(fwk, 1, 'FwK', false);
            }
        }
        else if(keyword == 'Schwertransport')
        {
            alertFhz(fustw, 4, 'FuStW', false);
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
                keyword == 'Feuer in Einfamilienhaus' ||
                keyword == 'Schornsteinbrand' ||
                keyword == 'Kaminbrand')
        {
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Rauchentwicklung in Museum')
        {
            alertFhz(fustw, 2, 'FuStW', false);
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gwa, 1, 'GW-A', false);
        }
        else if(keyword == 'Gasgeruch')
        {
            alertFhz(fustw, 1, 'FuStW', false);
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Kleinflugzeug abgestürzt')
        {
            alertFhz(fustw, 2, 'FuStW', false);
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
            alertFhz(fustw, 2, 'FuStW', false);
            alertFhz(lf, 3, 'LF', false, 'THL');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(ruest, 1, 'RÜST', false);
        }
        else if(keyword == 'Gefahrgut-LKW verunglückt ')
        {
            alertFhz(fustw, 2, 'FuStW', false);
            alertFhz(lf, 3, 'LF', false, 'THL');
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(ruest, 1, 'RÜST', false);
            alertFhz(gwg, 1, 'GW-G', false);
        }
        else if(keyword == 'Mittlerer Feldbrand' ||
                keyword == 'Großer Feldbrand')
        {
            alertFhz(lf, 5, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gws, 1, 'GW-S', false);
            if(help.slice(-3) == 133)
                alertFhz(fustw, 1, 'FuStW', false);
        }
        else if(keyword == 'Tankstellenbrand')
        {
            alertFhz(lf, 4, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(dl, 1, 'DL', false);
            alertFhz(gwg, 1, 'GW-G', false);
            alertFhz(gwm, 1, 'GW-M', false);
        }
        else if(keyword == 'Brand in Werkstatt')
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
            if(help.slice(-3) == 139 || help.slice(-3) == 141)
                alertFhz(lf, 4, 'LF', false, 'B');
            else
                alertFhz(lf, 2, 'LF', false, 'B');
            if(help.slice(-3) == 140 || help.slice(-3) == 141)
                alertFhz(fustw, 2, 'FuStW', false);
        }
        else if(keyword == 'Brennendes Reetdachhaus' ||
                keyword == 'Brennendes Reetdachhaus durch Feuerwerkskörper')
        {
            alertFhz(fustw, 2, 'FuStW', false);
            alertFhz(lf, 5, 'LF', false, 'B');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(gwa, 1, 'GW-A', false);
            alertFhz(elw1, 1, 'ELW1', false);
        }
        else if(keyword == 'Brennender Bus')
        {
            alertFhz(fustw, 2, 'FuStW', false);
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
            alertFhz(fustw, 2, 'FuStW', false);
            alertFhz(lf, 6, 'LF', false, 'B');
            alertFhz(dl, 2, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gwa, 1, 'GW-A', false);
            if(help.slice(-3) == 139)
            {
                alertFhz(fustw, 1, 'FuStW', false);
                alertFhz(lf, 4, 'LF', false);
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 2, 'ELW1', false);
            }
        }
        else if(keyword == 'Bürobrand (Groß)')
        {
            alertFhz(fustw, 3, 'FuStW', false);
            alertFhz(lf, 10, 'LF', false, 'B');
            alertFhz(dl, 2, 'DL', false);
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 3, 'ELW1', false);
            alertFhz(gwa, 1, 'GW-A', false);
            alertFhz(kdowlna, 1, 'LNA', false);
            alertFhz(kdoworgl, 1, 'OrgL', false);
            alertFhz(elw1seg, 1, 'ELW1-SEG', false);
        }
        else if(keyword == 'Ausgedehnte Ölspur')
        {
            alertFhz(fustw, 2, 'FuStW', false);
            alertFhz(lf, 6, 'LF', false, 'THL');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(oel, 1, 'GW-ÖL', false);
        }
        else if(keyword == 'Baumaschine umgestürzt')
        {
            alertFhz(fustw, 3, 'FuStW', false);
            alertFhz(lf, 4, 'LF', false, 'THL');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(dl, 1, 'DL', false);
            alertFhz(ruest, 2, 'RÜST', false);
            alertFhz(oel, 1, 'GW-ÖL', false);
            alertFhz(fwk, 1, 'FwK', false);
        }
        else if(keyword == 'Chlorgasaustritt')
        {
            alertFhz(fustw, 4, 'FuStW', false);
            alertFhz(lf, 7, 'LF', false, 'THL');
            alertFhz(gwa, 2, 'GW-A', false);
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 2, 'ELW1', false);
            alertFhz(gwm, 1, 'GW-M', false);
            alertFhz(gwg, 1, 'GW-G', false);
        }
        else if(keyword == 'Sporthallenbrand')
        {
            alertFhz(lf, 7, 'LF', false, 'B');
            alertFhz(dl, 2, 'DL', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gwa, 1, 'GW-A', false);
        }
        else if(keyword == 'Leck in Chemikalientank')
        {
            alertFhz(fustw, 2, 'FuStW', false);
            alertFhz(lf, 8, 'LF', false, 'B');
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(gwa, 1, 'GW-A', false);
            alertFhz(gwm, 2, 'GW-M', false);
            alertFhz(gwg, 1, 'GW-G', false);
            alertFhz(dekonp, 1, 'Dekon-P', false);
            alertFhz(oel, 1, 'GW-ÖL', false);
            alertFhz(ruest, 2, 'RÜST', false);
        }
        else if(keyword == 'Feuer auf Bauernhof - Mittel')
        {
            alertFhz(fustw, 3, 'FuStW', false);
            alertFhz(lf, 7, 'LF', false, 'B');
            alertFhz(gwa, 1, 'GW-A', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(dl, 2, 'DL', false);
            alertFhz(gws, 1, 'GW-S', false);
        }
        else if(keyword == 'Feuer auf Bauernhof - Groß')
        {
            alertFhz(fustw, 3, 'FuStW', false);
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
        }
        else if(keyword == 'Brennender Güterwaggon')
        {
            alertFhz(lf, 4, 'LF', false, 'B');
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(ruest, 2, 'RÜST', false);
            alertFhz(dl, 1, 'DL', false);
        }
        else if(keyword == 'Großer Waldbrand')
        {
            alertFhz(lf, 3, 'LF', false, 'B');
            alertFhz(gws, 1, 'GW-S', false);
            alertFhz(elw1, 1, 'ELW1', false);
            if(help.slice(-3) == 135)
                alertFhz(fustw, 1, 'FuStW', false);
        }
        else if(keyword == 'Großfeuer im Wald')
        {
            if(help.slice(-3) == 136)
            {
                alertFhz(fustw, 1, 'FuStW', false);
            }
            else
            {
                alertFhz(fustw, 3, 'FuStW', false);
            }
            alertFhz(lf, 10, 'LF', false, 'B');
            alertFhz(gwa, 1, 'GW-A', false);
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 2, 'ELW1', false);
            alertFhz(dl, 2, 'DL', false);
            alertFhz(ruest, 1, 'RÜST', false);
            alertFhz(gwg, 1, 'GW-G', false);
            alertFhz(gwm, 1, 'GW-M', false);
            alertFhz(dekonp, 1, 'Dekon-P', false);
        }
        else if(keyword == 'Beschädigter Kesselwagen')
        {
            alertFhz(fustw, 3, 'FuStW', false);
            alertFhz(lf, 10, 'LF', false);
            alertFhz(elw2, 1, 'ELW2', false);
            alertFhz(elw1, 2, 'ELW1', false, 'THL');
            alertFhz(dl, 1, 'DL', false);
            alertFhz(gws, 1, 'GW-S', false);
            alertFhz(gwm, 1, 'GW-M', false);
            alertFhz(gwg, 1, 'GW-G', false);
            alertFhz(gkw, 1, 'GKW', false);
        }
        else if(keyword == 'Gasexplosion')
        {
            alertFhz(fustw, 4, 'FuStW', false);
            alertFhz(lf, 20, 'LF', false);
            alertFhz(elw2, 2, 'ELW2', false);
            alertFhz(elw1, 4, 'ELW1', false, 'B');
            alertFhz(dl, 2, 'DL', false);
            alertFhz(fwk, 1, 'FwK', false);
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
            alertFhz(fustw, 2, 'FuStW', false);
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
            if(help.slice(-3) == 124 || help.slice(-3) == 126)
            {
                alertFhz(lf, 2, 'LF', false, 'THL');
                alertFhz(ruest, 1, 'RÜST', false);
            }
            else if(help.slice(-3) == 123 || help.slice(-3) == 125)
            {
                alertFhz(lf, 1, 'LF', false, 'THL');
                alertFhz(fustw, 1, 'FuStW', false);
            }
            else if(help.slice(-3) == 127)
            {
                alertFhz(lf, 2, 'LF', false, 'THL');
                alertFhz(ruest, 1, 'RÜST', false);
                alertFhz(fustw, 2, 'FuStW', false);
            }
        }
        else if(keyword == 'Person in Wasser')
        {
            alertFhz(boot, 1, 'Boot', false, 'RD');
            alertFhz(rtw, 1, 'RTW', false);
            alertFhz(nef, 1, 'NEF', false);
            if(help.slice(-3) == 246 || help.slice(-3) == 252)
            {
                alertFhz(lf, 3, 'LF', false, 'THL');
                alertFhz(elw1, 1, 'ELW1', false);
            }
        }
        else if(keyword == 'Gewässerverschmutzung durch Öl')
        {
            alertFhz(lf, 2, 'LF', false, 'THL');
            alertFhz(boot, 1, 'Boot', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(oel, 1, 'GW-ÖL', false);
            alertFhz(fustw, 1, 'FuStW', false);
        }
        else if(keyword == 'Pkw in Wasser')
        {
            alertFhz(lf, 3, 'LF', false, 'THL');
            alertFhz(boot, 2, 'Boot', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(fustw, 2, 'FuStW', false);
            alertFhz(gwt, 2, 'GW-T', false);
        }
        else if(keyword == 'LKW in Wasser' ||
                keyword == 'Bus in Wasser')
        {
            alertFhz(lf, 5, 'LF', false, 'THL');
            alertFhz(boot, 3, 'Boot', false);
            alertFhz(elw1, 1, 'ELW1', false);
            alertFhz(fustw, 3, 'FuStW', false);
            alertFhz(gwt, 3, 'GW-T', false);
        }
        else
        {
        }

        additionalFHZ();
        displayAlertDate();
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

            for (j=0;j<fuekw.length;j++) {
                if (fhz_id == fuekw[j]) {
                    anz_onSite_fuekw++;
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

            for (j=0;j<lkw7.length;j++) {
                if (fhz_id == lkw7[j]) {
                    anz_onSite_lkw7++;
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

            for (j=0;j<ktwb.length;j++) {
                if (fhz_id == ktwb[j]) {
                    anz_onSite_ktwb++;
                    if(seg_alerted)
                        anz_onSite_rtw++;
                    break;
                }
            }

            for (j=0;j<gwt.length;j++) {
                if (fhz_id == gwt[j]) {
                    anz_onSite_gwt++;
                    break;
                }
            }

            for (j=0;j<gww.length;j++) {
                if (fhz_id == gww[j]) {
                    anz_onSite_gww++;
                    break;
                }
            }

            for (j=0;j<boot.length;j++) {
                if (fhz_id == boot[j]) {
                    anz_onSite_boot++;
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

            for (j=0;j<fuekw.length;j++) {
                if (fhz_id == fuekw[j]) {
                    anz_Driving_fuekw++;
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

            for (j=0;j<lkw7.length;j++) {
                if (fhz_id == lkw7[j]) {
                    anz_Driving_lkw7++;
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

            for (j=0;j<ktwb.length;j++) {
                if (fhz_id == ktwb[j]) {
                    anz_Driving_ktwb++;
                    if(seg_alerted)
                        anz_Driving_rtw++;
                    break;
                }
            }

            for (j=0;j<gwt.length;j++) {
                if (fhz_id == gwt[j]) {
                    anz_Driving_gwt++;
                    break;
                }
            }

            for (j=0;j<gww.length;j++) {
                if (fhz_id == gww[j]) {
                    anz_Driving_gww++;
                    break;
                }
            }

            for (j=0;j<boot.length;j++) {
                if (fhz_id == boot[j]) {
                    anz_Driving_boot++;
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
            case "orgl":
                if (anzahl_rd >= 10)
                    toAlarm = toAlarm - (anz_onSite_kdoworgl + anz_Driving_kdoworgl);
                else
                    toAlarm = 0;
                break;
            case "lna":
                if (anzahl_rd >= 5)
                    toAlarm = toAlarm - (anz_onSite_kdowlna + anz_Driving_kdowlna);
                else
                    toAlarm = 0;
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
            case "fükw":
                toAlarm = toAlarm - (anz_onSite_fuekw + anz_Driving_fuekw);
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
            case "lkw 7":
                toAlarm = toAlarm - (anz_onSite_lkw7 + anz_Driving_lkw7);
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
                if (anzahl_seg >= 1)
                    toAlarm = toAlarm - (anz_onSite_gwsan + anz_Driving_gwsan);
                else
                    toAlarm = 0;
                break;
            case "elw1-seg":
                if (anzahl_seg >= 1)
                    toAlarm = toAlarm - (anz_onSite_elw1seg + anz_Driving_elw1seg);
                else
                    toAlarm = 0;
                break;
            case "ktw-b":
                if (anzahl_seg >= 1)
                    toAlarm = toAlarm - (anz_onSite_ktwb + anz_Driving_ktwb);
                else
                    toAlarm = 0;
                break;
            case "gw-t":
                toAlarm = toAlarm - (anz_onSite_gwt + anz_Driving_gwt);
                break;
            case "gw-w":
                toAlarm = toAlarm - (anz_onSite_gww + anz_Driving_gww);
                break;
            case "boot":
                toAlarm = toAlarm - (anz_onSite_boot + anz_Driving_boot);
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
                        //If AB/Anh is needed, check if a WLF/Zugfahrzeug is present
                        if((y >= 43 && y <= 44) || (y >= 47 && y <= 49) || y == 54 || (y >= 62 && y <= 64) || (y >= 66 && y <= 71))
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
        case "orgl":
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
        case "fükw":
            anz_Driving_fuekw = anz_Driving_fuekw+checked;
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
        case "lkw k 9":
            anz_Driving_lkwk9 = anz_Driving_lkwk9+checked;
            color = color_thw;
            break;
        case "lkw 7":
            anz_Driving_lkw7 = anz_Driving_lkw7+checked;
            color = color_thw;
            break;
        case "brmg r":
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
        case "ktw-b":
            anz_Driving_ktwb = anz_Driving_ktwb+checked;
            color = color_seg;
            break;
        case "gw-t":
            anz_Driving_gwt = anz_Driving_gwt+checked;
            color = color_wr;
            break;
        case "gw-w":
            anz_Driving_gww = anz_Driving_gww+checked;
            color = color_wr;
            break;
        case "boot":
            anz_Driving_boot = anz_Driving_boot+checked;
            color = color_wr;
            break;
    }
    if (checked < toAlarm && desc.toLowerCase() != 'ktw-b') {
        var regex = new RegExp('(, \\d ' + desc + ')', 'ig');
        var matches = 0;
        if (missingFhzText.match(regex) !== null)
            matches = missingFhzText.match(regex).length;

        missingFhzText = missingFhzText.replace(regex, '');
        missingFhzText = missingFhzText + ', '+(toAlarm-checked)+' '+desc;
        addedMissingFhzInformation = true;
        toAlarm = toAlarm - matches;
    }
    checked = 0;

    if (anzahl_orig > 0 && !additional && aao_key !== '')
        aao_text = '<font color='+color+'><b> '+aao_key+''+anzahl_orig+'</b></font>'+aao_text;
}

function RTW(keyword_rtw) {
    var patients = document.getElementsByClassName("patient_progress");
    var patients_anzahl = patients.length;
    var patient_progress = document.querySelectorAll('.progress-bar.progress-bar-danger:not(.progress-bar-striped)');
    var anzahl = 0;

    if(anz_onSite_gwsan > 0 || anz_Driving_gwsan > 0 || anz_onSite_elw1seg > 0 || anz_Driving_elw1seg > 0)
    {
        seg_alerted = true;
    }

    if (patients_anzahl > 0) {
        for (var i = 0;i<patients_anzahl;i++) {
            var width = $(patient_progress[i]).width();
            var parentWidth = $(patients).offsetParent().width();
            if (width == parentWidth) {
                anzahl++;
            }
        }

        //if(patients_anzahl >= 10 && anzahl_seg > 0)
        //{
        //    alertFhz(gwsan, 1, 'GW-SAN', false);
        //    seg_alerted = true;
        //}

        if(patients_anzahl >= 5)
        {
            if (anzahl_seg > 0) {
                alertFhz(elw1seg, 1, 'ELW1-SEG', false, 'SEG');
                alertFhz(gwsan, 1, 'GW-SAN', false);
                seg_alerted = true;
            }
            alertFhz(kdowlna, 1, 'LNA', false, 'LNA');
            alertFhz(kdoworgl, 1, 'OrgL', false, 'OrgL');
            //alertFhz(nef, 1-anz_Driving_nef, 'NEF', true);
        }

        if (patients_anzahl > 0)
        {
            var anz_transport = 0;
            if(anz_onSite_kdoworgl > 0 && anz_onSite_kdowlna > 0)
            {
                var needsTransport;
                for(var z = 1;z<=patients_anzahl;z++)
                {
                    var xpath = '//*[@id="col_left"]/small['+z+']/span[1]'
                    needsTransport = getElementByXpath(xpath);
                    if (needsTransport !== null)
                    {
                        if(needsTransport.className != 'label label-success')
                        {
                            anz_transport++;
                        }
                    }
                }
            }
            if(seg_alerted && anz_onSite_gwsan > 0 && anz_transport > 0)
            {
                alertFhz(ktwb, anz_transport, 'KTW-B', false, 'RD');
                alertFhz(rtw, anz_transport-anz_Driving_ktwb-anz_onSite_ktwb, 'RTW', false);
            }
            else if (anz_transport > 0)
            {
                alertFhz(rtw, anz_transport+1, 'RTW', false, 'RD');
            }
            else if (patients_anzahl < 5 && anz_onSite_gwsan < 1)
            {
                alertFhz(rtw, patients_anzahl, 'RTW', false, 'RD');
            }
        }
    }
    else
    {
        alertNef = false;
    }
    if(keyword_rtw == 'Kleinflugzeug abgestürzt')
    {
        alertFhz(nef, patients_anzahl, 'NEF', false);
    }
}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function additionalFHZ() {
    var count_lna = 0;
    var count_nef = 0;
    var count_rtw = 0;
    var count_orgl = 0;
    var count_rth = 0;
    for (var i = 0;i<additionalfhz.length;i++) {
        if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Zusätzlich benötigte Fahrzeuge:')>=0) {
            var additionalfhzInnerText = additionalfhz[i].innerText.replace(/\s\([a-zA-Z\s0-9]*\)/ig,'').replace('Zusätzlich benötigte Fahrzeuge: ','').replace(/[,]/ig,'').replace('ELW 2','ELW2').replace('ELW 1','ELW1').replace('1 ELW1 1 ELW2', '1 ELW2');
            var fhz = additionalfhzInnerText.split(' ');
            for (var ab=0;ab<fhz.length;ab++) {
                if((ab % 2) === 0) {
                    var j;
                    switch(fhz[ab+1]) {
                        case "Drehleitern":
                            alertFhz(dl, fhz[ab]-anz_Driving_dl, 'DL', true);
                            break;
                        case "Löschfahrzeug":
                            alertFhz(lf, fhz[ab]-anz_Driving_lf, 'LF', true);
                            break;
                        case "Löschfahrzeuge":
                            alertFhz(lf, fhz[ab]-anz_Driving_lf, 'LF', true);
                            break;
                        case "Rüstwagen":
                            alertFhz(ruest, fhz[ab]-anz_Driving_ruest, 'RÜST', true);
                            break;
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
                        case "GW-Öl":
                            alertFhz(oel, fhz[ab]-anz_Driving_oel, 'GW-ÖL', true);
                            break;
                        case "GW-Höhenrettung":
                            alertFhz(gwh, fhz[ab]-anz_Driving_gwh, 'GW-H', true);
                            break;
                        case "FwK":
                            alertFhz(fwk, fhz[ab]-anz_Driving_fwk, 'FwK', true);
                            break;
                        case "Dekon-P":
                            alertFhz(dekonp, fhz[ab]-anz_Driving_dekonp, 'Dekon-P', true);
                            break;
                        case "RTW":
                            alertFhz(rtw, fhz[ab]-anz_Driving_rtw, 'RTW', true);
                            break;
                    }
                }
            }
        }
        if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigen einen LNA.')>=0) {
            count_lna = 1;
        }
        else if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigen ein NEF.')>=0) {
            count_nef++;
        }
        else if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigen einen RTW.')>=0 && !seg_alerted) {
            count_rtw++;
        }
        else if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigen einen OrgL.')>=0) {
            count_orgl++;
        }
        else if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigten einen RTH.')>=0) {
            count_rth++;
        }
    }
    if (count_lna > 0)
    {
        alertFhz(kdowlna, 1-anz_Driving_kdowlna, 'LNA', true);
    }
    if (count_nef > 0)
    {
        alertFhz(nef, count_nef-anz_Driving_nef, 'NEF', true);
    }
    if (count_rtw > 0)
    {
        alertFhz(rtw, count_rtw-anz_Driving_rtw, 'RTW', true);
    }
    if (count_orgl > 0)
    {
        alertFhz(kdoworgl, 1-anz_Driving_kdoworgl, 'OrgL', true);
    }
    if (count_rth > 0)
    {
        alertFhz(rth, 1-anz_Driving_rth, 'RTH', true);
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

function addMissingFhzInfo() {
    if (addedMissingFhzInformation) {
        var aao_group = document.getElementById('missionH1');
        aao_group.insertAdjacentHTML('afterEnd', '<div class="alert alert-warning">Fehlende Fahrzeuge:<br>'+missingFhzText.substring(2, missingFhzText.length)+'</div>');
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
