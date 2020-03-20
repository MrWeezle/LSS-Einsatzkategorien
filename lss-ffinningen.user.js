// ==UserScript==
// @name        Einsatzkategorien
// @namespace   Leitstellenspiel
// @include     http*://www.leitstellenspiel.de/*
// @version     1.2.12
// @author      FFInningen
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-idle
// ==/UserScript==


//Farben für die einzelnen Orgas
var color_fw       = 'red';
var color_thw      = '#03a8f9';
var color_pol      = '#00de13';
var color_rd       = '#ff90a4';
var color_seg      = '#ff90a4';
var color_wr       = '#03a8f9';

//Wie lange das Script warten soll, bis es startet (notwendig um die korrekte Reihenfolge der Fahrzeuge zu ermitteln).
//Kann bei Bedarf erhöht werden, falls die falschen Fahrzeuge angeklickt werden
var timeout = 450;

//wie viele Feuerwachen wurden als Rettungswache ausgebaut und sind aktiv gesetzt?
var anz_rettungswache_ausbau = 3;

//wie viele Feuerwachen/THW-Wachen wurden als Wasserrettungswache ausgebaut?
var anz_wasserrettungswache_ausbau = 0;

var alertNef = true;
var addedRTW = false;
var seg_alerted = false;
var patients_anzahl = 0;

//FEUERWEHR
var lf       = [0, 1, 6, 7, 8, 9, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37];
var dl       = [2];
var elw1     = [3];
var elw2     = [34, 78];
var gwa      = [5, 48];
var ruest    = [4, 30, 47];
var oel      = [10, 49];
var dekonp   = [53, 54];
var gwg      = [27, 77];
var gwm      = [12];
var gws      = [11, 13, 14, 15, 16, 62];
var gwh      = [33];
var mtw      = [36];
var fwk      = [57];
var flf      = [75];
var rt       = [76];


//RETTUNGSDIENST
var rtw      = [28];
var ktw      = [38];
var nef      = [29];
var kdoworgl = [56];
var kdowlna  = [55];
var rth      = [31];
var grtw     = [73];
var naw      = [74];

//POLIZEI
var fustw    = [32];
var lebefkw  = [35];
var grukw    = [50];
var gefkw    = [52];
var ph       = [61];
var fuekw    = [51];
var wawe     = [72];
var sekzf    = [79];
var sekmtf   = [80];
var mekzf    = [81];
var mekmtf   = [82];

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
var ktwb     = [58, 28];

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
var anz_onSite_flf = 0;
var anz_onSite_rt = 0;
var anz_onSite_rtw = 0;
var anz_onSite_ktw = 0;
var anz_onSite_nef = 0;
var anz_onSite_rth = 0;
var anz_onSite_grtw = 0;
var anz_onSite_naw = 0;
var anz_onSite_kdoworgl = 0;
var anz_onSite_kdowlna = 0;
var anz_onSite_fustw = 0;
var anz_onSite_grukw = 0;
var anz_onSite_lebefkw = 0;
var anz_onSite_gefkw = 0;
var anz_onSite_ph = 0;
var anz_onSite_fuekw = 0;
var anz_onSite_wawe = 0;
var anz_onSite_sekzf = 0;
var anz_onSite_sekmtf = 0;
var anz_onSite_mekzf = 0;
var anz_onSite_mekmtf = 0;
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
var anz_Driving_flf = 0;
var anz_Driving_rt = 0;
var anz_Driving_rtw = 0;
var anz_Driving_ktw = 0;
var anz_Driving_nef = 0;
var anz_Driving_rth = 0;
var anz_Driving_grtw = 0;
var anz_Driving_naw = 0;
var anz_Driving_kdoworgl = 0;
var anz_Driving_kdowlna = 0;
var anz_Driving_fustw = 0;
var anz_Driving_grukw = 0;
var anz_Driving_lebefkw = 0;
var anz_Driving_gefkw = 0;
var anz_Driving_ph = 0;
var anz_Driving_fuekw = 0;
var anz_Driving_wawe = 0;
var anz_Driving_sekzf = 0;
var anz_Driving_sekmtf = 0;
var anz_Driving_mekzf = 0;
var anz_Driving_mekmtf = 0;
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

main();

function compareString(string1, string2) {
    return string1.toLowerCase() === string2.toLowerCase();
}
function includesString(string1, string2) {
    return string1.toLowerCase().includes(string2.toLowerCase());
}

function main() {
    if (title !== null) {
        origInner = title.innerHTML;
        title.innerHTML = title.innerHTML.replace(/(<small>\s*.+\s*.+\s.+\s.+\s*<\/small>)/ig, '').replace(/(<small>\s*.+\s*<\/small>)/ig, '').replace(/<span[^>]*>.*<\/span>/ig, '');
        var orig = title.innerText;
        title.innerHTML = origInner;
        keyword = orig;

        setTimeout(function(){
            debugger;
            var help_el = document.getElementById('mission_help');
            var help = "";
            if (help_el !== null)
                help = help_el.href;

            checkOnSiteVehicles();
            checkDrivingVehicles();
            setPatientsNumber();

            if(includesString(keyword, 'Brandmeldeanlage'))
            {
                alertFhz(rtw, 2, 'RTW', false);
            }
            keyword = keyword.replace(' (Brandmeldeanlage)','').trim();
            keyword = keyword.replace(' (BRANDMELDEANLAGE)','').trim();

            if (!compareString(keyword, 'Krankentransport'))
            {
                if(compareString(keyword, 'Herzinfarkt') ||
                    compareString(keyword, 'Krampfanfall') ||
                    compareString(keyword, 'Hitzschlag') ||
                    compareString(keyword, 'Hitzekrampf') ||
                    compareString(keyword, 'Unfall mit Motorsäge') ||
                    compareString(keyword, 'Bewusstlose Person') ||
                    compareString(keyword, 'Schwangere in Notsituation') ||
                    compareString(keyword, 'Beginnende Geburt') ||
                    compareString(keyword, 'Schädelverletzung') ||
                    compareString(keyword, 'Herzrhythmusstörungen') ||
                    compareString(keyword, 'akuter Asthma-Anfall') ||
                    compareString(keyword, 'Fieber') ||
                    compareString(keyword, 'Schlaganfall') ||
                    compareString(keyword, 'Bluthochdruck') ||
                    compareString(keyword, 'Vaginale Blutung') ||
                    compareString(keyword, 'Unterzuckerung') ||
                    compareString(keyword, 'Harnleiterblutung') ||
                    compareString(keyword, 'Handverletzung durch Feuerwerkskörper') ||
                    compareString(keyword, 'Stromschlag') ||
		    compareString(keyword, 'Grillunfall'))
                {
                    if (patients_anzahl > 0)
                    {
                        alertFhz(naw, patients_anzahl, 'NAW', false);
                        if(anz_Driving_naw < patients_anzahl)
                        {
                            alertFhz(nef, patients_anzahl-anz_Driving_naw, 'NEF', false);
                        }
                    }
                }
                RTW(keyword);
            }
            if (compareString(keyword, 'Krankentransport'))
            {
                alertFhz(ktw, 1, 'KTW', false, 'RD');
            }
            /************************************************************************************* GEPLANTE EINSÄTZE**************************************************************************/
            /*else if(compareString(keyword, 'Dorf/Stadtfest')
        {
            alertFhz(lf, 3, 'LF', false);
            alertFhz(gwsan, 1, 'GW-SAN', false);
            alertFhz(ktwb, 3, 'KTW-B', false);
        }*/
            else if(compareString(keyword, 'Volkslauf'))
            {
                alertFhz(gwsan, 1, 'GW-SAN', false, 'RD');
                alertFhz(ktwb, 3, 'KTW-B', false);
                if(3-(anz_Driving_ktwb+anz_onSite_ktwb)>0)
                    alertFhz(rtw, 3-(anz_Driving_ktwb+anz_onSite_ktwb), 'RTW', false);
            }
            else if(compareString(keyword, 'Entschärfung von Weltkriegsbombe'))
            {
                alertFhz(lf, 10, 'LF', false);
                alertFhz(fustw, 5, 'FuStW', false);
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 1, 'ELW1', false);
            }
            else if(compareString(keyword, 'Brandsicherheitswachdienst im Theater'))
            {
                alertFhz(lf, 1, 'LF', false);
                alertFhz(rtw, 1, 'RTW', false);
            }
            /************************************************************************************* RD ****************************************************************************************/
            else if(compareString(keyword, 'Stromschlag'))
            {
                alertFhz(rth, 1, 'RTH', false);
            }
            else if(compareString(keyword, 'Sturz aus Höhe') ||
                    compareString(keyword, 'Wirbelsäulenverletzung'))
            {
                if((help.slice(-3) == 180 || help.slice(-3) == 181) && anzahl_rth > 0)
                {
                    alertFhz(rth, 1, 'RTH', false);
                }
                else
                    alertFhz(nef, 1, 'NEF', false);
            }
            /************************************************************************************* POL *************************************************************************************/
            else if(compareString(keyword, 'Ladendiebstahl') ||
                    compareString(keyword, 'Parkendes Auto gerammt') ||
                    compareString(keyword, 'Metalldiebstahl') ||
                    compareString(keyword, 'Taschendiebstahl') ||
                    compareString(keyword, 'Notebook aus Schule entwendet') ||
                    compareString(keyword, 'Personalienaufnahme von Schwarzfahrer') ||
                    compareString(keyword, 'Einbruch in Keller') ||
                    compareString(keyword, 'Sachbeschädigung') ||
                    compareString(keyword, 'Angefahrene Person') ||
                    compareString(keyword, 'Ruhestörung') ||
                    compareString(keyword, 'Einbruch in Wohnung') ||
                    compareString(keyword, 'Pannenfahrzeug') ||
                    compareString(keyword, 'Hausfriedensbruch') ||
                    compareString(keyword, 'Trunkenheitsfahrt') ||
                    compareString(keyword, 'Trunkenheitsfahrt nach Silvesterparty') ||
                    compareString(keyword, 'Ampelausfall') ||
                    compareString(keyword, 'Verkehrsbehinderung') ||
                    compareString(keyword, 'Diebstahl aus Kfz') ||
                    compareString(keyword, 'Kfz durch Feuerwerkskörper beschädigt') ||
                    compareString(keyword, 'Verstoß gegen Sprengstoffverordnung') ||
                    compareString(keyword, 'Verstoss gegen Sprengstoffverordnung') ||
                    compareString(keyword, 'Kürbisse geklaut') ||
                    compareString(keyword, 'Süßigkeitendiebstahl') ||
                    compareString(keyword, 'Süssigkeitendiebstahl') ||
                    compareString(keyword, 'Fahrraddiebstahl') ||
                    compareString(keyword, 'Personenkontrolle') ||
                    compareString(keyword, 'Wildunfall') ||
                    compareString(keyword, 'Ostereier-Dieb') ||
                    compareString(keyword, 'Pinsel aus Werkstatt entwendet') ||
                    compareString(keyword, 'Angefahrener Osterhase') ||
                    compareString(keyword, 'Tankbetrug') ||
                    compareString(keyword, 'Auffahrunfall') ||
		    compareString(keyword, 'Herrenloses Gepäckstück') ||
		    compareString(keyword, 'Kind in PKW eingeschlossen'))
            {
                alertFhz(fustw, 1, 'FuStW', false, 'POL');
            }
            else if(compareString(keyword, 'Hilflose Person') ||
                    compareString(keyword, 'Angefahrender Osterhase'))
            {
                alertFhz(fustw, 1, 'FuStW', false, 'POL');
                alertFhz(rtw, 1, 'RTW', false);
            }
            else if(compareString(keyword, 'Randalierende Person') ||
                    compareString(keyword, 'Häusliche Gewalt') ||
                    compareString(keyword, 'Absicherung Musikumzug') ||
                    compareString(keyword, 'Verkehrsüberwachung') ||
                    compareString(keyword, 'Tiere auf der Fahrbahn') ||
		    compareString(keyword, 'Bank: Stiller Alarm'))
            {
                alertFhz(fustw, 2, 'FuStW', false, 'POL');
            }
            else if(compareString(keyword, 'Suche nach Vermissten'))
            {
                alertFhz(fustw, 2, 'FuStW', false, 'POL');
                alertFhz(ph, 1, 'PH', false);
                alertFhz(lf, 1, 'LF', false);
                alertFhz(rtw, 1, 'RTW', false);
            }
            else if(compareString(keyword, 'Frankenstein gesichtet') ||
                    compareString(keyword, 'Raub') ||
                    compareString(keyword, 'Schlägerei'))
            {
                alertFhz(fustw, 3, 'FuStW', false, 'POL');
            }
            else if(compareString(keyword, 'Kabeldiebstahl'))
            {
                alertFhz(fustw, 3, 'FuStW', false, 'POL');
                alertFhz(ph, 1, 'PH', false);
            }
            else if(compareString(keyword, 'Monster ausgebrochen') ||
                    compareString(keyword, 'Schwertransport') ||
                    compareString(keyword, 'Geplante Autobahnsperrung'))
            {
                alertFhz(fustw, 4, 'FuStW', false, 'POL');
            }
            else if(compareString(keyword, 'Massenschlägerei'))
            {
                alertFhz(fustw, 5, 'FuStW', false, 'POL');
            }
            else if(compareString(keyword, 'Gesprengter Geldautomat'))
            {
                alertFhz(fustw, 2, 'FuStW', false, 'POL');
                alertFhz(lf, 1, 'LF', false);
                alertFhz(ruest, 1, 'RÜST', false);
            }
            else if(compareString(keyword, 'Tankstellenüberfall'))
            {
                alertFhz(fustw, 6, 'FuStW', false, 'POL');
            }
            else if(compareString(keyword, 'Entflohener Gefangener'))
            {
                alertFhz(fustw, 10, 'FuStW', false, 'POL');
                alertFhz(ph, 1, 'PH', false);
            }
            else if(compareString(keyword, 'Absicherung Radrennen'))
            {
            }
            /************************************************************************************* BEPO ************************************************************************************/
            else if(compareString(keyword, 'Schwerpunkteinsatz Verkehrsüberwachung') ||
		    compareString(keyword, 'Präsenzeinsatz Volksfest') ||
		    compareString(keyword, 'Schwerpunkteinsatz Tageswohnungseinbrüche') ||
		    compareString(keyword, 'Geländedurchsuchung nach Beweismittel'))
            {
                alertFhz(lebefkw, 1, 'leBefKw', false, 'BP');
                alertFhz(grukw, 3, 'GruKW', false);
            }
            else if(compareString(keyword, 'Jugendschutzkontrolle in Diskothek'))
            {
                alertFhz(lebefkw, 1, 'leBefKw', false, 'BP');
                alertFhz(grukw, 3, 'GruKW', false);
                alertFhz(fustw, 2, 'FuStW', false);
            }
            else if(compareString(keyword, 'Großkontrolle Betäubungsmittel'))
            {
                alertFhz(lebefkw, 1, 'leBefKw', false, 'BP');
                alertFhz(grukw, 3, 'GruKW', false);
                alertFhz(fustw, 3, 'FuStW', false);
            }
            else if(compareString(keyword, 'Geplante Razzia'))
            {
                alertFhz(lebefkw, 2, 'leBefKw', false, 'BP');
                alertFhz(grukw, 6, 'GruKW', false);
                alertFhz(gefkw, 1, 'GefKW', false);
                alertFhz(fustw, 2, 'FuStW', false);
            }
            else if(compareString(keyword, 'Fußball Bundesliga-Spiel') ||
                    compareString(keyword, 'Fussball Bundesliga-Spiel') ||
                    compareString(keyword, 'Hasentreffen in Ostereistedt') ||
                    compareString(keyword, 'Absicherung Rockkonzert'))
            {
                alertFhz(lebefkw, 3, 'leBefKw', false, 'BP');
                alertFhz(grukw, 9, 'GruKW', false);
                alertFhz(fuekw, 1, 'FüKW', false);
                alertFhz(fustw, 2, 'FuStW', false);
                if(help.slice(-3) == 291 || help.slice(-3) == 275)
                {
                    alertFhz(rtw, 4, 'RTW', false);
                    alertFhz(fustw, 2, 'FuStW', false);
                    alertFhz(lf, 2, 'LF', false);
                }
                if(help.slice(-3) == 201)
                {
                    alertFhz(gefkw, 1, 'GefKW', false);
                }
                if(help.slice(-3) == 306)
                {
                    alertFhz(fustw, 6, 'FuStW', false);
                    alertFhz(lebefkw, 1, 'leBefKw', false);
                    alertFhz(rtw, 4, 'RTW', false);
                    alertFhz(wawe, 2, 'WaWe', false);
                }
            }
            else if(compareString(keyword, 'Angemeldete Demonstration'))
            {
                alertFhz(grukw, 6, 'GruKW', false);
                alertFhz(lebefkw, 2, 'leBefKw', false);
                alertFhz(fustw, 3, 'FuStW', false);
                alertFhz(fuekw, 1, 'FüKW', false);
                alertFhz(rtw, 1, 'RTW', false);
                if(help.slice(-3) == 304)
                {
                    alertFhz(lebefkw, 1, 'leBefKw', false);
                    alertFhz(lf, 1, 'LF', false);
                    alertFhz(rtw, 2, 'RTW', false);
                    alertFhz(wawe, 3, 'WaWe', false);
                    alertFhz(fustw, 3, 'FuStW', false);
                }
            }
	    else if(compareString(keyword, 'Absicherung Castor-Transport'))
	    {
		alertFhz(grukw, 18, 'GruKW', false);
                alertFhz(lebefkw, 6, 'leBefKw', false);
                alertFhz(fuekw, 2, 'FüKW', false);
                alertFhz(fustw, 10, 'FuStW', false);
                alertFhz(rtw, 2, 'RTW', false);
                alertFhz(ph, 1, 'PH', false);
                alertFhz(wawe, 2, 'WaWe', false);
	    }
            else if(compareString(keyword, 'Fußball Bundesliga-Risikospiel') ||
                    compareString(keyword, 'Fussball Bundesliga-Risikospiel'))
            {
                alertFhz(grukw, 27, 'GruKW', false);
                alertFhz(lebefkw, 9, 'leBefKw', false);
                alertFhz(fuekw, 3, 'FüKW', false);
                alertFhz(fustw, 5, 'FuStW', false);
                alertFhz(rtw, 4, 'RTW', false);
                alertFhz(lf, 2, 'LF', false);
                if(help.slice(-3) == 304)
                {
                    alertFhz(lebefkw, 1, 'leBefKw', false);
                    alertFhz(gefkw, 2, 'GefKW', false);
                    alertFhz(wawe, 3, 'WaWe', false);
                }
            }
            else if(compareString(keyword, 'Spontaner Aufstand'))
            {
                alertFhz(grukw, 9, 'GruKW', false);
                alertFhz(lebefkw, 4, 'leBefKw', false);
                alertFhz(fustw, 7, 'FuStW', false);
                alertFhz(fuekw, 1, 'FüKW', false);
                alertFhz(ph, 1, 'PH', false);
                alertFhz(wawe, 3, 'WaWe', false);
                alertFhz(gefkw, 1, 'GefKW', false);
            }
	    /********************************************************************************** SEK / MEK **********************************************************************************/
            else if(compareString(keyword, 'Waffenentzug'))
            {
                alertFhz(mekzf, 3, 'MEK ZF', false);                
                alertFhz(mekmtf, 1, 'MEK MTF', false);
                alertFhz(fustw, 4, 'FuStW', false);
                alertFhz(fuekw, 1, 'FüKW', false);
            }
	    else if(compareString(keyword, 'Geplante Razzia - Verdächtiger flüchtig'))
            {
                alertFhz(mekzf, 3, 'MEK ZF', false);                
                alertFhz(mekmtf, 1, 'MEK MTF', false);
                alertFhz(fustw, 5, 'FuStW', false);
                alertFhz(fuekw, 1, 'FüKW', false);
                alertFhz(ph, 1, 'PH', false);
		alertFhz(grukw, 6, 'GruKW', false);
                alertFhz(lebefkw, 2, 'leBefKw', false);
                alertFhz(gefkw, 1, 'GefKW', false);
            }
	    else if(compareString(keyword, 'Häusliche Gewalt - eskaliert'))
            {
                alertFhz(sekzf, 3, 'SEK ZF', false);                
                alertFhz(sekmtf, 1, 'SEK MTF', false);
                alertFhz(fustw, 4, 'FuStW', false);
                alertFhz(fuekw, 1, 'FüKW', false);
            }
	    else if(compareString(keyword, 'Banküberfall'))
            {
                alertFhz(sekzf, 3, 'SEK ZF', false);                
                alertFhz(sekmtf, 1, 'SEK MTF', false);
                alertFhz(fustw, 8, 'FuStW', false);
                alertFhz(fuekw, 1, 'FüKW', false);
                alertFhz(ph, 1, 'PH', false);
            }	    
	    else if(compareString(keyword, 'Vollstreckung Haftbefehl'))
	    {
		alertFhz(fustw, 2, 'FuStW', false);
	    }    
	    else if(compareString(keyword, 'Vollstreckung Haftbefehl - eskaliert'))
	    {
		alertFhz(fustw, 6, 'FuStW', false);
                alertFhz(fuekw, 1, 'FüKW', false);
                alertFhz(sekzf, 3, 'SEK ZF', false);                
                alertFhz(sekmtf, 1, 'SEK MTF', false);
	    }
            /************************************************************************************* THW *************************************************************************************/
            else if(compareString(keyword, 'LKW in Hauswand'))
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
            else if(compareString(keyword, 'Erdrutsch') ||
                    compareString(keyword, 'Eingestürzter Hasenbau'))
            {
                alertFhz(fustw, 2, 'FuStW', false);
                alertFhz(gkw, 1, 'GKW', false, 'THW');
                alertFhz(mtwtz, 1, 'MTW-TZ', false);
                alertFhz(brmgr, 1, 'BRmG R', false);
                alertFhz(mlw5, 1, 'MLW-5', false);
                alertFhz(lkwk9, 1, 'LKW K 9', false);
            }
            else if(compareString(keyword, 'Gefahrgut-LKW verunglückt'))
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
                alertFhz(gwm, 1, 'GW-M', false);
            }
            else if(compareString(keyword, 'Eingestürztes Wohnhaus'))
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
	    /************************************************************************************ FLFW *************************************************************************************/
	    else if(compareString(keyword, 'Rauch in Kabine'))
	    {
		alertFhz(lf, 2, 'LF', false);
		if(help.slice(-3) == 328)
                {
		    alertFhz(flf, 1, 'FLF', false);
		    alertFhz(rt, 1, 'RT', false);
		}
	    }
	    else if(compareString(keyword, 'Absicherung Betankung'))
	    {
		alertFhz(lf, 1, 'LF', false);
		alertFhz(flf, 2, 'FLF', false);
	    }
	    else if(compareString(keyword, 'Überhitzte Bremsen'))
	    {
		alertFhz(lf, 1, 'LF', false);
		alertFhz(flf, 1, 'FLF', false);
		alertFhz(rt, 1, 'RT', false);
		alertFhz(elw1, 1, 'ELW1', false);
	    }
	    else if(compareString(keyword, 'Flugzeugzusammenstoss am Boden') ||
		    compareString(keyword, 'Flugzeugzusammenstoß am Boden'))
	    {
		alertFhz(lf, 1, 'LF', false);
		alertFhz(flf, 2, 'FLF', false);
		alertFhz(rt, 1, 'RT', false);
		alertFhz(ruest, 2, 'RÜST', false);
		alertFhz(elw2, 1, 'ELW2', false);
		alertFhz(elw1, 2, 'ELW1', false);
	    }
	    else if(compareString(keyword, 'Triebwerksbrand'))
	    {
		alertFhz(flf, 4, 'FLF', false);
		alertFhz(ruest, 1, 'RÜST', false);
		alertFhz(lf, 2, 'LF', false);
		alertFhz(elw1, 1, 'ELW1', false);
	    }
	    else if(compareString(keyword, 'Brennendes Kleinflugzeug'))
	    {
		alertFhz(lf, 8, 'LF', false);
		alertFhz(dl, 1, 'DL', false);
		alertFhz(gws, 1, 'GW-S', false);
		alertFhz(ruest, 1, 'RÜST', false);
		alertFhz(elw2, 1, 'ELW2', false);
		alertFhz(elw1, 2, 'ELW1', false);
	    }
	    else if(compareString(keyword, 'Flugzeugbrand'))
	    {
		alertFhz(lf, 10, 'LF', false);
		alertFhz(flf, 4, 'FLF', false);
		alertFhz(rt, 1, 'RT', false);
		alertFhz(ruest, 3, 'RÜST', false);
		alertFhz(elw2, 1, 'ELW2', false);
		alertFhz(elw1, 2, 'ELW1', false);
	    }
            /************************************************************************************* FW **************************************************************************************/
            else if(compareString(keyword, 'Mülleimerbrand') ||
                    compareString(keyword, 'Containerbrand') ||
                    compareString(keyword, 'Brennender PKW') ||
                    compareString(keyword, 'Brennender PKW durch Feuerwerkskörper') ||
                    compareString(keyword, 'Motorrad-Brand') ||
                    compareString(keyword, 'Brennendes Laub') ||
                    compareString(keyword, 'Brennende Hecke') ||
                    compareString(keyword, 'Brennende Hecke durch Feuerwerkskörper') ||
                    compareString(keyword, 'Sperrmüllbrand') ||
                    compareString(keyword, 'Sperrmüllbrand durch Feuerwerkskörper') ||
                    compareString(keyword, 'Strohballen Brand') ||
                    compareString(keyword, 'Traktor Brand') ||
                    compareString(keyword, 'Brennende Telefonzelle') ||
                    compareString(keyword, 'Kleiner Waldbrand') ||
                    compareString(keyword, 'Brand in Briefkasten') ||
                    compareString(keyword, 'Brennendes Gebüsch') ||
                    compareString(keyword, 'Brennender Anhänger') ||
                    compareString(keyword, 'Fettbrand in Pommesbude') ||
                    compareString(keyword, 'Brennendes Bus-Häuschen') ||
                    compareString(keyword, 'Brennendes Bus-Häuschen durch Feuerwerkskörper') ||
                    compareString(keyword, 'Brennender Adventskranz') ||
                    compareString(keyword, 'Brennende Papiercontainer') ||
                    compareString(keyword, 'Brennende Papiercontainer durch Feuerwerkskörper') ||
                    compareString(keyword, 'Feuerprobealarm an Schule') ||
                    compareString(keyword, 'Brennender Bollerwagen') ||
                    compareString(keyword, 'Brennendes Osternest') ||
                    compareString(keyword, 'Brennende Vogelscheuche') ||
                    compareString(keyword, 'Ausgelöster Heimrauchmelder') ||
                    compareString(keyword, 'Brennendes Kürbisfeld') ||
		    compareString(keyword, 'Brennender Tannenbaum') ||
		    compareString(keyword, 'Brennender Blumenstrauß') ||
		    compareString(keyword, 'Brennender Blumenstrauss'))
            {
                alertFhz(lf, 1, 'LF', false, 'B');
            }
            else if(compareString(keyword, 'Baum auf Straße') ||
                    compareString(keyword, 'Baum auf Strasse') ||
                    compareString(keyword, 'Kleintier in Not') ||
                    compareString(keyword, 'Keller unter Wasser') ||
                    compareString(keyword, 'Kleine Ölspur') ||
                    compareString(keyword, 'Auslaufende Betriebsstoffe') ||
                    compareString(keyword, 'Tiefgarage unter Wasser') ||
                    compareString(keyword, 'Äste auf Fahrbahn') ||
                    compareString(keyword, 'Umherfliegendes Baumaterial') ||
                    compareString(keyword, 'Baum auf Dach') ||
                    compareString(keyword, 'Baum auf Radweg') ||
                    compareString(keyword, 'Schokoladenspur auf Strasse') ||
                    compareString(keyword, 'Hexe hängt in Baum'))
            {
                alertFhz(lf, 1, 'LF', false, 'THL');
                if(help.slice(-3) == 114)
                {
                    alertFhz(dl, 1, 'DL', false);
                }
            }
            else if(compareString(keyword, 'Person in Baugrube'))
            {
                alertFhz(lf, 1, 'LF', false);
                alertFhz(dl, 1, 'DL', false);
                alertFhz(ruest, 1, 'RÜST', false);
            }
            else if(compareString(keyword, 'Straße unter Wasser') ||
                    compareString(keyword, 'Strasse unter Wasser'))
			{
                alertFhz(lf, 1, 'LF', false, 'THL');
                if(help.slice(-3) == 173)
                {
                    alertFhz(fustw, 2, 'FuStW', false);
                }
            }
            else if(compareString(keyword, 'Verletzte Person auf Baugerüst'))
            {
                alertFhz(elw1, 1, 'ELW1', false, 'THL');
                alertFhz(lf, 1, 'LF', false);
                alertFhz(rtw, 1, 'RTW', false);
                alertFhz(gwh, 1, 'GW-H', false);
                alertFhz(dl, 1, 'DL', false);
            }
            else if(compareString(keyword, 'Verletzte Person auf Hochspannungsmast') ||
                    compareString(keyword, 'Abgestürzter Kletterer'))
            {
                alertFhz(lf, 2, 'LF', false, 'THL');
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(rtw, 1, 'RTW', false);
                alertFhz(gwh, 1, 'GW-H', false);
                alertFhz(dl, 1, 'DL', false);
                alertFhz(fustw, 1, 'FuStW', false);
                if(help.slice(-3) == 236 || help.slice(-3) == 300)
                {
                    alertFhz(rth, 1, 'RTH', false);
                }
                else
                {
                    alertFhz(nef, 1, 'NEF', false);
                }
            }
            else if(compareString(keyword, 'Bewusstloser Kranführer'))
            {
                alertFhz(nef, 1, 'NEF', false, 'RD');
                alertFhz(lf, 1, 'LF', false, 'THL');
                alertFhz(rtw, 1, 'RTW', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(gwh, 1, 'GW-H', false);
                alertFhz(fustw, 1, 'FuStW', false);
            }
            else if(compareString(keyword, 'Fassadenteile drohen zu fallen'))
            {
                alertFhz(lf, 1, 'LF', false, 'THL');
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(fustw, 1, 'FuStW', false);
                alertFhz(dl, 1, 'DL', false);
                alertFhz(gwh, 1, 'GW-H', false);
            }
            else if(compareString(keyword, 'Person im Aufzug'))
            {
                alertFhz(ruest, 1, 'RÜST', false, 'THL');
                alertFhz(rtw, 1, 'RTW', false);
            }
            else if(compareString(keyword, 'Große Ölspur') ||
                    compareString(keyword, 'Grosse Ölspur'))
            {
                alertFhz(lf, 1, 'LF', false, 'THL');
                alertFhz(oel, 1, 'GW-ÖL', false);
            }
            else if(compareString(keyword, 'Parkdeck voll Wasser gelaufen'))
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
            else if(compareString(keyword, 'Person unter Baum eingeklemmt') ||
                    compareString(keyword, 'Reitunfall mit Pkw'))
            {
                alertFhz(lf, 1, 'LF', false, 'THL');
                alertFhz(fustw, 1, 'FuStW', false);
                alertFhz(nef, 1, 'NEF', false);
                if(anz_Driving_rtw < 1 && anz_onSite_rtw < 1)
                    alertFhz(rtw, 1, 'RTW', false);
            }
            else if(compareString(keyword, 'Person hinter Tür') ||
                    compareString(keyword, 'Motorradunfall'))
            {
                alertFhz(lf, 1, 'LF', false, 'THL');
                alertFhz(rtw, 1, 'RTW', false);
                alertFhz(fustw, 1, 'FuStW', false);
                alertFhz(nef, 1, 'NEF', false);
            }
            else if(compareString(keyword, 'Baum auf Gleisen') ||
                    compareString(keyword, 'Baum auf PKW'))
            {
                alertFhz(fustw, 1, 'FuStW', false);
                alertFhz(lf, 1, 'LF', false, 'THL');
            }
            else if(compareString(keyword, 'Gartenlaubenbrand') ||
                    compareString(keyword, 'Brennender LKW') ||
                    compareString(keyword, 'Kleiner Feldbrand') ||
                    compareString(keyword, 'Kleiner Feldbrand durch Feuerwerkskörper') ||
                    compareString(keyword, 'Wohnwagenbrand') ||
                    compareString(keyword, 'Küchenbrand') ||
                    compareString(keyword, 'Garagenbrand') ||
                    compareString(keyword, 'Mähdrescher Brand') ||
                    compareString(keyword, 'Brennendes Gras') ||
                    compareString(keyword, 'Eierkocherbrand') ||
                    compareString(keyword, 'Carportbrand') ||
                    compareString(keyword, 'Brennender Müllwagen') ||
                    compareString(keyword, 'Brennendes Kürbisfeld'))
            {
                if(help.slice(-3) == 100 || help.slice(-3) == 101 || help.slice(-3) == 103 || help.slice(-3) == 105)
                    alertFhz(fustw, 1, 'FuStW', false);
                alertFhz(lf, 2, 'LF', false, 'B');
            }
            else if(compareString(keyword, 'Geplatzte Wasserleitung') ||
                    compareString(keyword, 'Kürbissuppe übergekocht'))
            {
                alertFhz(lf, 2, 'LF', false, 'THL');
                alertFhz(elw1, 1, 'ELW1', false);
            }
            else if(compareString(keyword, 'Mitarbeiter unter PKW eingeklemmt') ||
                    compareString(keyword, 'Person in Baumaschine eingeklemmt') ||
                    compareString(keyword, 'Dehnfugenbrand') ||
                    compareString(keyword, 'Einsturzgefährdeter Balkon') ||
		    compareString(keyword, 'Eingestürzter Balkon'))
            {
                alertFhz(lf, 2, 'LF', false, 'THL');
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(ruest, 1, 'RÜST', false);
                if(help.slice(-3) == 323)
                {
                    alertFhz(dl, 1, 'DL', false);
                    alertFhz(fustw, 1, 'FuStW', false);
                }
		    alert(help);
		if(help.slice(-3) == 393)
		{
			alertFhz(dl, 1, 'DL', false);
			alertFhz(fustw, 1, 'FuStW', false);  
			alertFhz(gkw, 1, 'GKW', false);   
		}
		if(help.slice(-3) == 447)
		{
		    alertFhz(lf, 1, 'LF', false);
		    alertFhz(fwk, 1, 'FwK', false);
		    alertFhz(fustw, 2, 'FuStW', false); 
		    alertFhz(gkw, 1, 'GKW', false);   
                    alertFhz(mtwtz, 1, 'MTW-TZ', false);
                    alertFhz(mlw5, 1, 'MLW-5', false);
                    alertFhz(mzkw, 1, 'MzKW', false); 
		}
            }
            else if(compareString(keyword, 'Feuer auf Balkon') ||
                    compareString(keyword, 'Feuer auf Balkon durch Feuerwerkskörper') ||
                    compareString(keyword, 'Zimmerbrand') ||
                    compareString(keyword, 'Verunglückter Fallschirmspringer'))
            {
                alertFhz(lf, 2, 'LF', false, 'B');
                alertFhz(dl, 1, 'DL', false);
                if(help.slice(-3) == 101)
                    alertFhz(fustw, 1, 'FuStW', false);
                if(help.slice(-3) == 312)
                    alertFhz(nef, 1, 'NEF', false);
            }
            else if(compareString(keyword, 'Beschädigter Dachbereich') ||
		    compareString(keyword, 'Brandgeruch'))
            {
                alertFhz(lf, 2, 'LF', false, 'THL');
                alertFhz(dl, 1, 'DL', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(fustw, 1, 'FuStW', false);
            }
            else if(compareString(keyword, 'Verletzte Person auf Hochspannungsmast') ||
		    compareString(keyword, 'Höhenrettung am Fahrgeschäft'))
            {
                alertFhz(lf, 2, 'LF', false, 'THL');
                alertFhz(gwh, 1, 'GW-H', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(fustw, 1, 'FuStW', false);
		if(help.slice(-3) == 345)
		{
                    alertFhz(dl, 1, 'DL', false);
                    alertFhz(ruest, 1, 'RÜST', false);
		}
            }
            else if(compareString(keyword, 'Brennende Trafostation'))
            {
                alertFhz(lf, 2, 'LF', false, 'B');
                alertFhz(elw1, 1, 'ELW1', false);
                if(help.slice(-3) == 193)
                    alertFhz(fustw, 1, 'FuStW', false);
            }
            else if(compareString(keyword, 'LKW in Supermarkt'))
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
            else if(compareString(keyword, 'Verkehrsunfall mit Linienbus'))
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
                    if(patients_anzahl > 0)
                        alertFhz(kdowlna, 1, 'LNA', false);
                }
            }
            else if(compareString(keyword, 'LKW umgestürzt'))
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
            else if(compareString(keyword, 'Verkehrsunfall mit Zug'))
            {
                alertFhz(fustw, 2, 'FuStW', false);
                alertFhz(lf, 2, 'LF', false, 'THL');
                alertFhz(ruest, 1, 'RÜST', false);
                alertFhz(elw1, 1, 'ELW1', false);
            }
            else if(compareString(keyword, 'Verkehrsunfall mit Linienbus'))
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
            else if(compareString(keyword, 'Pfefferspray in Schule'))
            {
                alertFhz(lf, 2, 'LF', false);
                alertFhz(fustw, 3, 'FuStW', false, 'POL');
                alertFhz(gwm, 1, 'GW-M', false);
            }
            else if(compareString(keyword, 'Feuer in Schnellrestaurant'))
            {
                alertFhz(lf, 3, 'LF', false, 'B');
            }
            else if (compareString(keyword, 'Brandsicherheitswache bei Volksfest'))
            {
                alertFhz(lf, 3, 'LF', false);
                alertFhz(fustw, 1, 'FuStW', false, 'POL');
            }
            else if(compareString(keyword, 'Großer Waldbrand ') ||
                    compareString(keyword, 'Grosser Waldbrand '))
            {
                alertFhz(lf, 3, 'LF', false, 'B');
                alertFhz(gws, 1, 'GW-S', false);
                alertFhz(elw1, 1, 'ELW1', false);
            }
            else if(compareString(keyword, 'Brand im Supermarkt'))
            {
                alertFhz(lf, 3, 'LF', false, 'B');
                alertFhz(dl, 1, 'DL', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(ruest, 1, 'RÜST', false);
            }
            else if(compareString(keyword, 'Baum auf Oberleitung'))
            {
                alertFhz(lf, 3, 'LF', false, 'THL');
                alertFhz(dl, 1, 'DL', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(ruest, 1, 'RÜST', false);
            }
            else if(compareString(keyword, 'Gasunfall in Werkstatt') || 
		    compareString(keyword, 'PKW im Gleisbett'))
            {
                alertFhz(lf, 3, 'LF', false, 'THL');
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(ruest, 1, 'RÜST', false);
		    
		if(help.slice(-3) == 385) {
                	alertFhz(fustw, 1, 'FuStW', false);
		}
            }
            else if(compareString(keyword, 'Kellerbrand') ||
                    compareString(keyword, 'Kellerbrand durch Feuerwerkskörper'))
            {
                alertFhz(lf, 3, 'LF', false, 'B');
                alertFhz(elw1, 1, 'ELW1', false);
            }
            else if(compareString(keyword, 'Maschinenbrand'))
            {
                alertFhz(lf, 3, 'LF', false, 'B');
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(gwa, 1, 'GW-A', false);
                alertFhz(gws, 1, 'GW-S', false);
            }
            else if(compareString(keyword, 'Dachstuhlbrand') ||
                    compareString(keyword, 'Feuer in Einfamilienhaus') ||
                    compareString(keyword, 'Schornsteinbrand') ||
                    compareString(keyword, 'Kaminbrand'))
            {
                alertFhz(lf, 3, 'LF', false, 'B');
                alertFhz(dl, 1, 'DL', false);
                alertFhz(elw1, 1, 'ELW1', false);
                if(help.slice(-3) == 103 || help.slice(-3) == 105)
                    alertFhz(fustw, 1, 'FuStW', false);
            }
            else if(compareString(keyword, 'Rauchentwicklung in Museum') ||
                    compareString(keyword, 'Saunabrand'))
            {
                alertFhz(fustw, 2, 'FuStW', false);
                alertFhz(lf, 3, 'LF', false, 'B');
                alertFhz(dl, 1, 'DL', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(gwa, 1, 'GW-A', false);
            }
            else if(compareString(keyword, 'Gasgeruch'))
            {
                alertFhz(fustw, 1, 'FuStW', false);
                alertFhz(lf, 3, 'LF', false, 'B');
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(gwg, 1, 'GW-G', false);
                alertFhz(gwm, 1, 'GW-M', false);
                alertFhz(dekonp, 1, 'Dekon-P', false);
            }
            else if(compareString(keyword, 'Kleinflugzeug abgestürzt'))
            {
                alertFhz(fustw, 2, 'FuStW', false);
                alertFhz(lf, 3, 'LF', false, 'THL');
                alertFhz(elw1, 1, 'ELW1', false);
            }
            else if(compareString(keyword, 'Aufgerissener Öltank'))
            {
                alertFhz(lf, 3, 'LF', false, 'THL');
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(oel, 1, 'GW-ÖL', false);
            }
            else if(compareString(keyword, 'LKW Auffahrunfall'))
            {
                alertFhz(fustw, 2, 'FuStW', false);
                alertFhz(lf, 3, 'LF', false, 'THL');
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(ruest, 1, 'RÜST', false);
            }
            else if(compareString(keyword, 'Gefahrgut-LKW verunglückt '))
            {
                alertFhz(fustw, 2, 'FuStW', false);
                alertFhz(lf, 3, 'LF', false, 'THL');
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(ruest, 1, 'RÜST', false);
                alertFhz(gwg, 1, 'GW-G', false);
                alertFhz(gwm, 1, 'GW-M', false);
            }
            else if(compareString(keyword, 'Mittlerer Feldbrand') ||
                    compareString(keyword, 'Großer Feldbrand') ||
                    compareString(keyword, 'Grosser Feldbrand'))
            {
                alertFhz(lf, 5, 'LF', false, 'B');
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(gws, 1, 'GW-S', false);
                if(help.slice(-3) == 133)
                    alertFhz(fustw, 1, 'FuStW', false);
            }
            else if(compareString(keyword, 'Tankstellenbrand'))
            {
                alertFhz(lf, 4, 'LF', false, 'B');
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(dl, 1, 'DL', false);
                alertFhz(gwg, 1, 'GW-G', false);
                alertFhz(gwm, 1, 'GW-M', false);
            }
            else if(compareString(keyword, 'Brand in Werkstatt'))
            {
                alertFhz(lf, 4, 'LF', false, 'B');
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(dl, 1, 'DL', false);
                alertFhz(gwm, 1, 'GW-M', false);
            }
            else if(compareString(keyword, 'Feuer im Krankenhaus') ||
                    compareString(keyword, 'Scheunenbrand') ||
		    compareString(keyword, 'Mehrere brennende Fahrzeuge'))
            {
                alertFhz(lf, 4, 'LF', false);
                alertFhz(dl, 1, 'DL', false);
                alertFhz(elw1, 1, 'ELW1', false);
                if(help.slice(-3) == 344)
		    alertFhz(ruest, 1, 'RÜST', false);
            }
            else if(compareString(keyword, 'Brennende Lok'))
            {
                alertFhz(lf, 4, 'LF', false, 'B');
                alertFhz(gwa, 1, 'GW-A', false);
                alertFhz(ruest, 1, 'RÜST', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(gws, 1, 'GW-S', false);
            }
            else if(compareString(keyword, 'Flächenbrand'))
            {
                if(help.slice(-3) == 139 || help.slice(-3) == 141)
                {
                    alertFhz(lf, 7, 'LF', false, 'B');
                    alertFhz(gws, 1, 'GW-S', false);
                    alertFhz(elw1, 1, 'ELW1', false);
                }
                else
                {
                    alertFhz(lf, 2, 'LF', false, 'B');
                }

                if(help.slice(-3) == 141)
		{    
		    alertFhz(fustw, 2, 'FuStW', false);
		}
            }
            else if(compareString(keyword, 'Brennendes Reetdachhaus') ||
                    compareString(keyword, 'Brennendes Reetdachhaus durch Feuerwerkskörper'))
            {
                alertFhz(fustw, 2, 'FuStW', false);
                alertFhz(lf, 5, 'LF', false, 'B');
                alertFhz(dl, 1, 'DL', false);
                alertFhz(gwa, 1, 'GW-A', false);
                alertFhz(elw1, 1, 'ELW1', false);
            }
            else if(compareString(keyword, 'Strohballen qualmen in Scheune'))
            {
                alertFhz(lf, 5, 'LF', false, 'B');
                alertFhz(dl, 1, 'DL', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(gwa, 1, 'GW-A', false);
                alertFhz(gws, 1, 'GW-S', false);
            }
            else if(compareString(keyword, 'Brennender Bus'))
            {
                alertFhz(fustw, 2, 'FuStW', false);
                alertFhz(lf, 5, 'LF', false, 'B');
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(ruest, 1, 'RÜST', false);
            }
            else if(compareString(keyword, 'Großbrand') ||
                    compareString(keyword, 'Grossbrand'))
            {
                alertFhz(lf, 6, 'LF', false, 'B');
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 2, 'ELW1', false);
                alertFhz(dl, 2, 'DL', false);
                alertFhz(gws, 1, 'GW-S', false);
                alertFhz(gwa, 1, 'GW-A', false);
            }
            else if(compareString(keyword, 'Tiefgaragenbrand'))
            {
                alertFhz(lf, 6, 'LF', false, 'B');
                alertFhz(dl, 2, 'DL', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(gwa, 2, 'GW-A', false);
                alertFhz(gwm, 1, 'GW-M', false);
                alertFhz(oel, 1, 'GW-ÖL', false);
                alertFhz(fustw, 1, 'FuStW', false);
            }
            else if(compareString(keyword, 'Brand im Terminal'))
            {
                alertFhz(lf, 6, 'LF', false, 'B');
                alertFhz(dl, 2, 'DL', false);
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 2, 'ELW1', false);
                alertFhz(gwa, 1, 'GW-A', false);
                alertFhz(gwm, 1, 'GW-M', false);
                alertFhz(fustw, 2, 'FuStW', false);
            }
            else if(compareString(keyword, 'Bürobrand'))
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
            else if(compareString(keyword, 'Bürobrand (Groß)') ||
                    compareString(keyword, 'Bürobrand (Gross)'))
            {
                alertFhz(fustw, 3, 'FuStW', false);
                alertFhz(lf, 10, 'LF', false, 'B');
                alertFhz(dl, 2, 'DL', false);
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 3, 'ELW1', false);
                alertFhz(gwa, 1, 'GW-A', false);
                if(patients_anzahl > 0)
                {
                    alertFhz(kdowlna, 1, 'LNA', false);
                    alertFhz(kdoworgl, 1, 'OrgL', false);
                    alertFhz(elw1seg, 1, 'ELW1-SEG', false);
                }
            }
            else if(compareString(keyword, 'Ausgedehnte Ölspur'))
            {
                alertFhz(fustw, 2, 'FuStW', false);
                alertFhz(lf, 6, 'LF', false, 'THL');
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(oel, 1, 'GW-ÖL', false);
            }
            else if(compareString(keyword, 'Baumaschine umgestürzt'))
            {
                alertFhz(fustw, 3, 'FuStW', false);
                alertFhz(lf, 4, 'LF', false, 'THL');
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(dl, 1, 'DL', false);
                alertFhz(ruest, 2, 'RÜST', false);
                alertFhz(oel, 1, 'GW-ÖL', false);
                alertFhz(fwk, 1, 'FwK', false);
            }
            else if(compareString(keyword, 'Chlorgasaustritt'))
            {
                alertFhz(fustw, 4, 'FuStW', false);
                alertFhz(lf, 7, 'LF', false, 'THL');
                alertFhz(gwa, 2, 'GW-A', false);
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 2, 'ELW1', false);
                alertFhz(gwm, 1, 'GW-M', false);
                alertFhz(gwg, 1, 'GW-G', false);
            }
            else if(compareString(keyword, 'Sporthallenbrand'))
            {
                alertFhz(lf, 7, 'LF', false, 'B');
                alertFhz(dl, 2, 'DL', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(gwa, 1, 'GW-A', false);
                alertFhz(gws, 1, 'GW-S', false);
            }
            else if(compareString(keyword, 'Leck in Chemikalientank'))
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
            else if(compareString(keyword, 'Feuer auf Bauernhof - Mittel'))
            {
                alertFhz(fustw, 3, 'FuStW', false);
                alertFhz(lf, 7, 'LF', false, 'B');
                alertFhz(gwa, 1, 'GW-A', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(dl, 2, 'DL', false);
                alertFhz(gws, 1, 'GW-S', false);
            }
            else if(compareString(keyword, 'Feuer auf Bauernhof - Groß') ||
                    compareString(keyword, 'Feuer auf Bauernhof - Gross'))
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
            else if(compareString(keyword, 'Brennender Güterwaggon'))
            {
                alertFhz(lf, 4, 'LF', false, 'B');
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(ruest, 2, 'RÜST', false);
                alertFhz(dl, 1, 'DL', false);
            }
            else if(compareString(keyword, 'Großer Waldbrand') ||
                    compareString(keyword, 'Grosser Waldbrand'))
            {
                alertFhz(lf, 3, 'LF', false, 'B');
                alertFhz(gws, 1, 'GW-S', false);
                alertFhz(elw1, 1, 'ELW1', false);
                if(help.slice(-3) == 135)
                    alertFhz(fustw, 1, 'FuStW', false);
            }
            else if(compareString(keyword, 'Großfeuer im Wald') ||
                    compareString(keyword, 'Grossfeuer im Wald'))
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
                alertFhz(gws, 2, 'GW-S', false);
                alertFhz(ruest, 1, 'RÜST', false);
                alertFhz(gwg, 1, 'GW-G', false);
                alertFhz(gwm, 1, 'GW-M', false);
                alertFhz(dekonp, 1, 'Dekon-P', false);
            }
            else if(compareString(keyword, 'Beschädigter Kesselwagen'))
            {
                alertFhz(fustw, 3, 'FuStW', false);
                alertFhz(lf, 10, 'LF', false);
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 2, 'ELW1', false, 'THL');
                alertFhz(dl, 1, 'DL', false);
                alertFhz(gwm, 1, 'GW-M', false);
                alertFhz(gwg, 1, 'GW-G', false);
                alertFhz(gkw, 1, 'GKW', false);
                alertFhz(dekonp, 1, 'Dekon-P', false);
            }
	    else if(compareString(keyword, 'Brennende Kirche'))
	    {
		alertFhz(lf, 15, 'LF', false);
		alertFhz(dl, 3, 'DL', false);
                alertFhz(gws, 2, 'GW-S', false);
                alertFhz(gwa, 2, 'GW-A', false);
                alertFhz(ruest, 4, 'RÜST', false);
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 3, 'ELW1', false);                
		alertFhz(gwm, 1, 'GW-M', false);
                alertFhz(gkw, 1, 'GKW', false);
                alertFhz(mzkw, 1, 'MzKW', false);
                alertFhz(mtwtz, 1, 'MTW-TZ', false);
                alertFhz(brmgr, 1, 'BRmG R', false);
                alertFhz(lkwk9, 1, 'LKW K 9', false);
                alertFhz(anhdle, 1, 'Anh DLE', false);
                alertFhz(mlw5, 1, 'MLW-5', false);
	    }
            else if(compareString(keyword, 'Gasexplosion'))
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
            else if(compareString(keyword, 'Feuer im Lagerraum'))
            {
                alertFhz(lf, 2, 'LF', false, 'B');
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(dl, 1, 'DL', false);
            }
            else if(compareString(keyword, 'Lagerhallenbrand'))
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
            else if(compareString(keyword, 'Verkehrsunfall'))
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
                else if(help.slice(-2) == 25)
                {
                    alertFhz(lf, 1, 'LF', false, 'THL');
                }
                else if(help.slice(-3) == 127)
                {
                    alertFhz(lf, 2, 'LF', false, 'THL');
                    alertFhz(ruest, 1, 'RÜST', false);
                    alertFhz(fustw, 2, 'FuStW', false);
                }
            }
            else if(compareString(keyword, 'Person in Wasser') ||
                    compareString(keyword, 'Hilflose Person auf Wasser') ||
                    compareString(keyword, 'Tauchunfall'))
            {
                alertFhz(boot, 1, 'Boot', false, 'RD');
                alertFhz(rtw, 1, 'RTW', false);
                alertFhz(nef, 1, 'NEF', false);
                if(help.slice(-3) == 246 || help.slice(-3) == 252)
                {
                    alertFhz(lf, 3, 'LF', false, 'THL');
                    alertFhz(elw1, 1, 'ELW1', false);
                }
                if(help.slice(-3) == 298)
                {
                    alertFhz(rth, 1, 'RTH', false);
                }
                if(help.slice(-3) == 309 || help.slice(-3) == 310)
                {
                    alertFhz(gwt, 1, 'GW-T', false);
                }
            }
            else if(compareString(keyword, 'Gewässerverschmutzung durch Öl'))
            {
                alertFhz(lf, 2, 'LF', false, 'THL');
                alertFhz(boot, 1, 'Boot', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(oel, 1, 'GW-ÖL', false);
                alertFhz(fustw, 1, 'FuStW', false);
            }
            else if(compareString(keyword, 'Pkw in Wasser'))
            {
                alertFhz(lf, 3, 'LF', false, 'THL');
                alertFhz(boot, 2, 'Boot', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(fustw, 2, 'FuStW', false);
                alertFhz(gwt, 2, 'GW-T', false);
            }
            else if(compareString(keyword, 'LKW in Wasser') ||
                    compareString(keyword, 'Bus in Wasser'))
            {
                alertFhz(lf, 5, 'LF', false, 'THL');
                alertFhz(boot, 3, 'Boot', false);
                alertFhz(elw1, 1, 'ELW1', false);
                alertFhz(fustw, 3, 'FuStW', false);
                alertFhz(gwt, 3, 'GW-T', false);
            }
            else if(compareString(keyword, 'Helikopter in Baum'))
            {
                alertFhz(lf, 6, 'LF', false, 'THL');
                alertFhz(dl, 1, 'DL', false);
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 2, 'ELW1', false, 'B');
                alertFhz(ruest, 2, 'RÜST', false);
                alertFhz(oel, 1, 'GW-ÖL', false);
                alertFhz(gwh, 1, 'GW-H', false);
                alertFhz(fustw, 3, 'FuStW', false);
                alertFhz(fwk, 1, 'FwK', false);
            }
            else if(compareString(keyword, 'Brennendes Kleinflugzeug'))
            {
                alertFhz(fustw, 3, 'FuStW', false);
                alertFhz(lf, 8, 'LF', false);
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 2, 'ELW1', false, 'B');
                alertFhz(dl, 1, 'DL', false);
                alertFhz(gws, 1, 'GW-S', false);
                alertFhz(oel, 1, 'GW-ÖL', false);
            }
            else if(compareString(keyword, 'Chemieunfall an Schule'))
            {
                alertFhz(lf, 8, 'LF', false);
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 2, 'ELW1', false, 'B');
                alertFhz(dl, 1, 'DL', false);
                alertFhz(gwa, 1, 'GW-A', false);
                alertFhz(dekonp, 1, 'Dekon-P', false);
                alertFhz(gwm, 1, 'GW-M', false);
                alertFhz(gwg, 2, 'GW-G', false);
            }
            else if(compareString(keyword, 'Unbekannte Substanz'))
            {
                alertFhz(lf, 12, 'LF', false);
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 2, 'ELW1', false, 'B');
                alertFhz(gwa, 1, 'GW-A', false);
                alertFhz(dekonp, 1, 'Dekon-P', false);
                alertFhz(gwm, 2, 'GW-M', false);
                alertFhz(gwg, 1, 'GW-G', false);
                alertFhz(fustw, 4, 'FuStW', false);
            }
	    else if(compareString(keyword, 'Brand in Mehrfamilienhaus'))
	    {
		alertFhz(lf, 12, 'LF', false);
                alertFhz(dl, 3, 'DL', false);
                alertFhz(elw2, 1, 'ELW2', false);
                alertFhz(elw1, 3, 'ELW1', false, 'B');
                alertFhz(gwa, 1, 'GW-A', false);
                alertFhz(gws, 1, 'GW-S', false);
                alertFhz(gwm, 2, 'GW-M', false);
                alertFhz(ruest, 1, 'RÜST', false);
                alertFhz(fustw, 4, 'FuStW', false);
	    }
            else if(compareString(keyword, 'Brand in Baumarkt'))
            {
                alertFhz(lf, 15, 'LF', false);
                alertFhz(dl, 3, 'DL', false);
                alertFhz(elw2, 2, 'ELW2', false);
                alertFhz(elw1, 4, 'ELW1', false);
                alertFhz(gwa, 2, 'GW-A', false);
                alertFhz(gwm, 2, 'GW-M', false);
                alertFhz(gwg, 1, 'GW-G', false);
                alertFhz(gws, 1, 'GW-S', false);
                alertFhz(fwk, 1, 'FwK', false);
                alertFhz(ruest, 1, 'RÜST', false);
                alertFhz(fustw, 5, 'FuStW', false);
                alertFhz(gkw, 2, 'GKW', false);
                alertFhz(mtwtz, 2, 'MTW-TZ', false);
                alertFhz(brmgr, 2, 'BRmG R', false);
                alertFhz(lkwk9, 2, 'LKW K 9', false);
                alertFhz(mzkw, 2, 'MzKW', false);
                alertFhz(mlw5, 1, 'MLW-5', false);
            }
	    else if(compareString(keyword, 'Explosion in Biogasanlage'))
	    {
		alertFhz(lf, 20, 'LF', false);
                alertFhz(dl, 2, 'DL', false);
                alertFhz(ruest, 4, 'RÜST', false);
                alertFhz(gwa, 2, 'GW-A', false);
                alertFhz(gwm, 1, 'GW-M', false);
                alertFhz(oel, 1, 'GW-ÖL', false);
                alertFhz(gws, 1, 'GW-S', false);
                alertFhz(elw2, 2, 'ELW2', false);
                alertFhz(elw1, 4, 'ELW1', false);
                alertFhz(fustw, 3, 'FuStW', false);
                alertFhz(brmgr, 1, 'BRmG R', false);
                alertFhz(lkwk9, 1, 'LKW K 9', false);
                alertFhz(mzkw, 1, 'MzKW', false);
                alertFhz(gkw, 1, 'GKW', false);
                alertFhz(mtwtz, 1, 'MTW-TZ', false);
                alertFhz(mlw5, 1, 'MLW-5', false);
	    }
            else if(compareString(keyword, 'Großfeuer im Krankenhaus') ||
                    compareString(keyword, 'Grossfeuer im Krankenhaus'))
            {
                alertFhz(lf, 20, 'LF', false);
                alertFhz(dl, 5, 'DL', false);
                alertFhz(elw2, 4, 'ELW2', false);
                alertFhz(elw1, 6, 'ELW1', false);
                alertFhz(gwa, 3, 'GW-A', false);
                alertFhz(dekonp, 1, 'Dekon-P', false);
                alertFhz(gwm, 3, 'GW-M', false);
                alertFhz(gwg, 2, 'GW-G', false);
                alertFhz(gws, 2, 'GW-S', false);
                alertFhz(gwh, 1, 'GW-H', false);
                alertFhz(ruest, 2, 'RÜST', false);
                alertFhz(fustw, 6, 'FuStW', false);
                alertFhz(gkw, 1, 'GKW', false, 'THW');
                alertFhz(mtwtz, 1, 'MTW-TZ', false);
                alertFhz(brmgr, 1, 'BRmG R', false);
                alertFhz(mlw5, 1, 'MLW-5', false);
                alertFhz(lkwk9, 1, 'LKW K 9', false);
                alertFhz(mzkw, 1, 'MzKW', false);
            }
            else
            {
                if(addedMissingFhzInformation)
                    missingFhzText += "<br>Einsatz nicht bekannt";
                else
                {
                    if (anz_Driving_rtw < 1 && anz_onSite_rtw < 1)
                    {
                        missingFhzText = ", Einsatz nicht bekannt";
                        addedMissingFhzInformation = true;
                    }
                }
            }

            additionalFHZ();
            var title_bar = document.getElementsByClassName('mission_header_info row');
            title_bar[0].scrollIntoView();
            //title.scrollIntoView();
            //if (document.getElementById('amount_of_people') !== null)
            //document.getElementById('amount_of_people').scrollIntoView();

            addMissingFhzInfo();
            var done = $('.glyphicon-user');
            if(done.length > 0)
                done[0].style.color = 'green';
            else
            {
                done = document.getElementsByClassName('glyphicon-asterisk');
                if(done.length > 0)
                    done[0].style.color = 'green';
            }
        }, timeout);
    }
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
                    anz_onSite_elw1++;
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
            for (j=0;j<flf.length;j++) {
                if (fhz_id == flf[j]) {
                    anz_onSite_flf++;
                    break;
                }
            }
            for (j=0;j<rt.length;j++) {
                if (fhz_id == rt[j]) {
                    anz_onSite_rt++;
                    break;
                }
            }
            for (j=0;j<rtw.length;j++) {
                if (fhz_id == rtw[j]) {
                    anz_onSite_rtw++;
                    anz_onSite_ktwb++;
                    break;
                }
            }
            for (j=0;j<grtw.length;j++) {
                if (fhz_id == grtw[j]) {
                    anz_onSite_grtw++;
                    anz_onSite_rtw += 7;
                    anz_onSite_ktwb += 7;
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
            for (j=0;j<naw.length;j++) {
                if (fhz_id == naw[j]) {
                    anz_onSite_rtw++;
                    anz_onSite_nef++;
                    anz_onSite_naw++;
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
            for (j=0;j<ph.length;j++) {
                if (fhz_id == ph[j]) {
                    anz_onSite_ph++;
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
            for (j=0;j<fuekw.length;j++) {
                if (fhz_id == fuekw[j]) {
                    anz_onSite_fuekw++;
                    break;
                }
            }
            for (j=0;j<wawe.length;j++) {
                if (fhz_id == wawe[j]) {
                    anz_onSite_wawe++;
                    break;
                }
            }
            for (j=0;j<wawe.length;j++) {
                if (fhz_id == wawe[j]) {
                    anz_onSite_wawe++;
                    break;
                }
            }
            for (j=0;j<sekzf.length;j++) {
                if (fhz_id == sekzf[j]) {
                    anz_onSite_sekzf++;
                    break;
                }
            }
            for (j=0;j<sekmtf.length;j++) {
                if (fhz_id == sekmtf[j]) {
                    anz_onSite_sekmtf++;
                    break;
                }
            }
            for (j=0;j<mekzf.length;j++) {
                if (fhz_id == mekzf[j]) {
                    anz_onSite_mekzf++;
                    break;
                }
            }
            for (j=0;j<mekmtf.length;j++) {
                if (fhz_id == mekmtf[j]) {
                    anz_onSite_mekmtf++;
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
                    anz_Driving_elw1++;
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
            for (j=0;j<flf.length;j++) {
                if (fhz_id == flf[j]) {
                    anz_Driving_flf++;
                    break;
                }
            }
            for (j=0;j<rt.length;j++) {
                if (fhz_id == rt[j]) {
                    anz_Driving_rt++;
                    break;
                }
            }
            for (j=0;j<rtw.length;j++) {
                if (fhz_id == rtw[j]) {
                    anz_Driving_rtw++;
                    anz_Driving_ktwb++;
                    found=true;
                    break;
                }
            }
            for (j=0;j<grtw.length;j++) {
                if (fhz_id == grtw[j]) {
                    anz_Driving_grtw++;
                    anz_Driving_rtw += 7;
                    anz_Driving_ktwb += 7;
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
            for (j=0;j<naw.length;j++) {
                if (fhz_id == naw[j]) {
                    anz_Driving_rtw++;
                    anz_Driving_nef++;
                    anz_Driving_naw++;
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
            for (j=0;j<ph.length;j++) {
                if (fhz_id == ph[j]) {
                    anz_Driving_ph++;
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
            for (j=0;j<fuekw.length;j++) {
                if (fhz_id == fuekw[j]) {
                    anz_Driving_fuekw++;
                    break;
                }
            }
            for (j=0;j<wawe.length;j++) {
                if (fhz_id == wawe[j]) {
                    anz_Driving_wawe++;
                    break;
                }
            }
            for (j=0;j<sekzf.length;j++) {
                if (fhz_id == sekzf[j]) {
                    anz_Driving_sekzf++;
                    break;
                }
            }
            for (j=0;j<sekmtf.length;j++) {
                if (fhz_id == sekmtf[j]) {
                    anz_Driving_sekmtf++;
                    break;
                }
            }
            for (j=0;j<mekzf.length;j++) {
                if (fhz_id == mekzf[j]) {
                    anz_Driving_mekzf++;
                    break;
                }
            }
            for (j=0;j<mekmtf.length;j++) {
                if (fhz_id == mekmtf[j]) {
                    anz_Driving_mekmtf++;
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
                    toAlarm = toAlarm - (anz_onSite_elw1 + anz_Driving_elw1);
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
            case "flf":
                toAlarm = toAlarm - (anz_onSite_flf + anz_Driving_flf);
                break;
            case "rt":
                toAlarm = toAlarm - (anz_onSite_rt + anz_Driving_rt);
                break;
            case "rtw":
                if((anz_onSite_lf > 0 || anz_onSite_fustw > 0 || anz_onSite_gkw > 0 || anz_onSite_boot > 0) && patients_anzahl === 0)
                    toAlarm = 0;
                else
                    toAlarm = toAlarm - (anz_onSite_rtw + anz_Driving_rtw);
                break;
            case "grtw":
                toAlarm = toAlarm - (anz_onSite_grtw + anz_Driving_grtw);
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
            case "naw":
                if (anzahl_rd >= 3)
                    toAlarm = toAlarm - (anz_onSite_naw + anz_Driving_naw);
                else
                    toAlarm = 0;
                break;
            case "rth":
                if (anzahl_rth >= 1)
                    toAlarm = toAlarm - (anz_onSite_rth + anz_Driving_rth);
                else
                    toAlarm = 0;
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
                if (anzahl_pol >= 1)
                    toAlarm = toAlarm - (anz_onSite_fustw + anz_Driving_fustw);
                else
                    toAlarm = 0;
                break;
            case "ph":
                if (anzahl_ph >= 1)
                    toAlarm = toAlarm - (anz_onSite_ph + anz_Driving_ph);
                else
                    toAlarm = 0;
                break;
            case "lebefkw":
                if (anzahl_bepo >= 1)
                    toAlarm = toAlarm - (anz_onSite_lebefkw + anz_Driving_lebefkw);
                else
                    toAlarm = 0;
                break;
            case "grukw":
                if (anzahl_bepo >= 1)
                    toAlarm = toAlarm - (anz_onSite_grukw + anz_Driving_grukw);
                else
                    toAlarm = 0;
                break;
            case "gefkw":
                if (anzahl_bepo >= 1)
                    toAlarm = toAlarm - (anz_onSite_gefkw + anz_Driving_gefkw);
                else
                    toAlarm = 0;
                break;
            case "fükw":
                if (anzahl_bepo >= 1)
                    toAlarm = toAlarm - (anz_onSite_fuekw + anz_Driving_fuekw);
                else
                    toAlarm = 0;
                break;
            case "wawe":
                if (anzahl_bepo >= 1)
                    toAlarm = toAlarm - (anz_onSite_wawe + anz_Driving_wawe);
                else
                    toAlarm = 0;
                break;			
            case "sek zf":
                if (anzahl_bepo >= 1)
                    toAlarm = toAlarm - (anz_onSite_sekzf + anz_Driving_sekzf);
                else
                    toAlarm = 0;
                break;			
            case "sek mtf":
                if (anzahl_bepo >= 1)
                    toAlarm = toAlarm - (anz_onSite_sekmtf + anz_Driving_sekmtf);
                else
                    toAlarm = 0;
                break;			
            case "mek zf":
                if (anzahl_bepo >= 1)
                    toAlarm = toAlarm - (anz_onSite_mekzf + anz_Driving_mekzf);
                else
                    toAlarm = 0;
                break;			
            case "mek mtf":
                if (anzahl_bepo >= 1)
                    toAlarm = toAlarm - (anz_onSite_mekmtf + anz_Driving_mekmtf);
                else
                    toAlarm = 0;
                break;
            case "gkw":
                if (anzahl_thw >= 1)
                    toAlarm = toAlarm - (anz_onSite_gkw + anz_Driving_gkw);
                else
                    toAlarm = 0;
                break;
            case "mzkw":
                if (anzahl_thw >= 1)
                    toAlarm = toAlarm - (anz_onSite_mzkw + anz_Driving_mzkw);
                else
                    toAlarm = 0;
                break;
            case "mtw-tz":
                if (anzahl_thw >= 1)
                    toAlarm = toAlarm - (anz_onSite_mtwtz + anz_Driving_mtwtz);
                else
                    toAlarm = 0;
                break;
            case "lkw k 9":
                if (anzahl_thw >= 1)
                    toAlarm = toAlarm - (anz_onSite_lkwk9 + anz_Driving_lkwk9);
                else
                    toAlarm = 0;
                break;
            case "lkw 7":
                if (anzahl_thw >= 1)
                    toAlarm = toAlarm - (anz_onSite_lkw7 + anz_Driving_lkw7);
                else
                    toAlarm = 0;
                break;
            case "brmg r":
                if (anzahl_thw >= 1)
                    toAlarm = toAlarm - (anz_onSite_brmgr + anz_Driving_brmgr);
                else
                    toAlarm = 0;
                break;
            case "anh dle":
                if (anzahl_thw >= 1)
                    toAlarm = toAlarm - (anz_onSite_anhdle + anz_Driving_anhdle);
                else
                    toAlarm = 0;
                break;
            case "mlw-5":
                if (anzahl_thw >= 1)
                    toAlarm = toAlarm - (anz_onSite_mlw5 + anz_Driving_mlw5);
                else
                    toAlarm = 0;
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
                    toAlarm = toAlarm - (anz_onSite_ktwb + anz_Driving_ktwb) - (anz_onSite_rtw + anz_Driving_rtw);
                else
                    toAlarm = 0;
                break;
            case "gw-t":
                if (anzahl_wr >= 1)
                    toAlarm = toAlarm - (anz_onSite_gwt + anz_Driving_gwt);
                else
                    toAlarm = 0;
                break;
            case "gw-w":
                if (anzahl_wr >= 1)
                    toAlarm = toAlarm - (anz_onSite_gww + anz_Driving_gww);
                else
                    toAlarm = 0;
                break;
            case "boot":
                if (anzahl_wr >= 1)
                    toAlarm = toAlarm - (anz_onSite_boot + anz_Driving_boot);
                else
                    toAlarm = 0;
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
                        if((y >= 43 && y <= 44) || (y >= 47 && y <= 49) || y == 54 || y == 62 || (y >= 66 && y <= 68) || (y >= 70 && y <= 71) || y == 77)
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
        var fahrzeug2;
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
                            fahrzeug2 = x[k].children[0];

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
        if (checked === 0 && desc == 'MTW'){
            desc_orig = desc;
            desc='LF';
            fhz = lf;
            for (var m=0;m<x.length;m++) {
                //get vehicle_type_id attribute
                var zz = x[m].getAttribute('vehicle_type_id');
                //check if element has the proper attribute
                if (zz !== null) {
                    //check the Vehicle array for the vehicle_type_id
                    for (var n=0;n<fhz.length;n++) {
                        //if vehice is found
                        if (zz == fhz[n] && checked < toAlarm) {
                            //click the vehicle
                            fahrzeug2 = x[m].children[0];

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
        case "flf":
            anz_Driving_flf = anz_Driving_flf+checked;
            color = color_fw;
            break;
        case "rt":
            anz_Driving_rt = anz_Driving_rt+checked;
            color = color_fw;
            break;
        case "rtw":
            anz_Driving_rtw = anz_Driving_rtw+checked;
            color = color_rd;
            break;
        case "grtw":
            anz_Driving_grtw = anz_Driving_grtw+checked;
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
        case "naw":
            anz_Driving_naw = anz_Driving_naw+checked;
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
        case "wawe":
            anz_Driving_wawe = anz_Driving_wawe+checked;
            color = color_pol;
            break;
        case "sekzf":
            anz_Driving_sekzf = anz_Driving_sekzf+checked;
            color = color_pol;
            break;
        case "sekmtf":
            anz_Driving_sekmtf = anz_Driving_sekmtf+checked;
            color = color_pol;
            break;
        case "mekzf":
            anz_Driving_mekzf = anz_Driving_mekzf+checked;
            color = color_pol;
            break;
        case "mekmtf":
            anz_Driving_mekmtf = anz_Driving_mekmtf+checked;
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
    if (checked < toAlarm && desc.toLowerCase() != 'ktw-b' && desc.toLowerCase() != 'naw') {
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

function setPatientsNumber() {
    var patients = document.getElementsByClassName("patient_progress");
    patients_anzahl = patients.length;
}

function RTW(keyword_rtw) {
    var patient_progress = document.querySelectorAll('.progress-bar.progress-bar-danger:not(.progress-bar-striped)');
    var anzahl = 0;

    if(anz_onSite_gwsan > 0 || anz_Driving_gwsan > 0 || anz_onSite_elw1seg > 0 || anz_Driving_elw1seg > 0)
    {
        seg_alerted = true;
    }

    if (patients_anzahl > 0) {
        /*for (var i = 0;i<patients_anzahl;i++) {
            var width = $(patient_progress[i]).width();
            var parentWidth = $(patients).offsetParent().width();
            if (width == parentWidth) {
                anzahl++;
            }
        }

        if(patients_anzahl >= 10 && anzahl_seg > 0)
        {
            alertFhz(gwsan, 1, 'GW-SAN', false);
            seg_alerted = true;
        }*/

        if(patients_anzahl >= 5)
        {
            alertFhz(grtw, 1, 'GRTW', false);
            if (anzahl_seg > 0) {
                alertFhz(elw1seg, 1, 'ELW1-SEG', false, 'SEG');
                alertFhz(gwsan, 1, 'GW-SAN', false);
                //alertFhz(ktwb, patients_anzahl/2, 'KTW-B', false);
                seg_alerted = true;
            }
            alertFhz(kdowlna, 1, 'LNA', false, 'LNA');
            if(patients_anzahl >= 10)
            {
                alertFhz(kdoworgl, 1, 'OrgL', false, 'OrgL');
            }
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
                    var xpath = '//*[@id="col_left"]/div['+z+']/small/span[6]';
                    needsTransport = getElementByXpath(xpath);
                    if (needsTransport !== null)
                    {
                        if(needsTransport.innerText == 'Ja')
                        {
                            xpath = '//*[@id="col_left"]/div['+z+']/small/span[8]';
                            var rtw_at_person = getElementByXpath(xpath);
                            if (rtw_at_person !== null)
                            {
                                if(rtw_at_person.innerText == 'Nein')
                                {
                                    anz_transport++;
                                }
                            }
                        }
                    }
                }
            }
            if(seg_alerted && anz_onSite_gwsan > 0 && anz_transport > 0)
            {
                alertFhz(ktwb, anz_transport, 'KTW-B', false, 'RD');
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
    if(keyword_rtw == 'Kleinflugzeug abgestürzt' ||
       keyword_rtw == 'Brennendes Kleinflugzeug')
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
    var count_ktw = 0;
    var count_orgl = 0;
    var count_rth = 0;
    var count_mtw = 0;
    for (var i = 0;i<additionalfhz.length;i++) {
        if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Zusätzlich benötigte Fahrzeuge:')>=0) {
            var additionalfhzInnerText = additionalfhz[i].innerText.replace(/\s\([a-zA-Z\s0-9]*\)/ig,'').replace('Zusätzlich benötigte Fahrzeuge: ','').replace(/[,\.]/ig,'').replace('ELW 2','ELW2').replace('ELW 1','ELW1').replace('1 ELW1 1 ELW2', '1 ELW2').replace('Anhänger','');
            var fhz = additionalfhzInnerText.split(' ');
            for (var ab=0;ab<fhz.length;ab++) {
                if((ab % 2) === 0) {
                    var j;
                    switch(fhz[ab+1]) {
                        case "Drehleiter":
                            alertFhz(dl, fhz[ab]-anz_Driving_dl, 'DL', true);
                            break;
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
                        case "FüKw":
                            alertFhz(fuekw, fhz[ab]-anz_Driving_fuekw, 'FüKW', true);
                            break;
                        case "SEK-Fahrzeuge":
			    if(fhz[ab] < 5) {
                            	alertFhz(sekmtf, 1, 'SEK MTF', true);
                            	alertFhz(sekzf, 3, 'SEK ZF', true);
			    }
			    else if(fhz[ab] > 5) {
				alertFhz(sekmtf, 2, 'SEK MTF', true);
                            	alertFhz(sekzf, 6, 'SEK ZF', true);
			    }
                            break;
                        case "SEK-Fahrzeug":
                            alertFhz(sekzf, fhz[ab]-anz_Driving_sekzf-anz_Driving_sekmtf, 'SEK ZF', true);
                            alertFhz(sekmtf, fhz[ab]-anz_Driving_sekmtf-anz_Driving_sekzf, 'SEK MTF', true);
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
                        case "GW-SAN":
                            alertFhz(rtw, fhz[ab]-anz_Driving_rtw, 'RTW', true);
                            break;
                        case "Gerätekraftwagen":
                            alertFhz(gkw, fhz[ab]-anz_Driving_gkw, 'GKW', true);
                            break;
                        case "Radlader":
                            alertFhz(brmgr, fhz[ab]-anz_Driving_brmgr, 'BRmG R', true);
                            break;
                        case "THW-Einsatzleitung":
                            alertFhz(mtwtz, fhz[ab]-anz_Driving_mtwtz, 'MTW-TZ', true);
                            break;
                        case "THW-Mehrzweckkraftwagen":
                            alertFhz(mzkw, fhz[ab]-anz_Driving_mzkw, 'MzKW', true);
                            break;
                        case "GW-Taucher":
                            alertFhz(gwt, fhz[ab]-anz_Driving_gwt, 'GW-T', true);
                            break;
                        case "GruKw":
                            alertFhz(grukw, fhz[ab]-anz_Driving_grukw, 'GruKW', true);
                            break;
                        case "leBefKw":
                            alertFhz(lebefkw, fhz[ab]-anz_Driving_lebefkw, 'leBefKw', true);
                            break;
                        case "Wasserwerfer":
                            alertFhz(wawe, fhz[ab]-anz_Driving_wawe, 'WaWe', true);
                            break;
                        case "Flugfeldlöschefahrzeug":
                            alertFhz(flf, fhz[ab]-anz_Driving_flf, 'FLF', true);
                            break;
                        case "Flugfeldlöschfahrzeug":
                            alertFhz(flf, fhz[ab]-anz_Driving_flf, 'FLF', true);
                            break;
                    }
                }
            }
        }
        if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigen einen LNA.')>=0) {
            count_lna = 1;
        }
        else if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigen: NEF')>=0) {
            count_nef++;
        }
        else if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigen einen RTW.')>=0 && !seg_alerted) {
            count_rtw++;
        }
        else if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigen einen OrgL.')>=0) {
            count_orgl = 1;
        }
        else if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigten: RTH')>=0) {
            count_rth++;
        }
        else if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigen einen RTW oder KTW Typ B.')>=0 && anz_onSite_kdoworgl < 1 && anz_Driving_kdoworgl < 1) {
            count_ktw++;
        }
        else if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigen eine Tragehilfe')>=0) {
            count_mtw = 1;
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
    if (count_ktw > 0)
    {
        alertFhz(ktwb, count_ktw-anz_Driving_ktw, 'KTW-B', true);
    }
    if (count_orgl > 0)
    {
        alertFhz(kdoworgl, 1-anz_Driving_kdoworgl, 'OrgL', true);
    }
    if (count_rth > 0)
    {
        alertFhz(rth, 1-anz_Driving_rth, 'RTH', true);
    }
    if (count_mtw > 0)
    {
        alertFhz(mtw, 1-anz_Driving_mtw, 'MTW', true);
    }
}

function addMissingFhzInfo() {
    if (addedMissingFhzInformation) {
        var missing_vehicles_load = document.getElementsByClassName('missing_vehicles_load');
        if(missing_vehicles_load.length > 0) {
            missing_vehicles_load[0].click();
            addedMissingFhzInformation = false;
            main();
        }
        else
        {
            var aao_group = document.getElementById('missionH1');
            aao_group.insertAdjacentHTML('afterEnd', '<div class="alert alert-warning">Fehlende Fahrzeuge:<br>'+missingFhzText.substring(2, missingFhzText.length)+'</div>');
            addedMissingFhzInformation = false;
        }
    }
}
