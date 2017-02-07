// ==UserScript==
// @name        Einsatzkategorien
// @namespace   Leitstellenspiel
// @include     http*://www.leitstellenspiel.de/*
// @version     0.2.0.1
// @author      FFInningen
// @grant       none
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

var anz_onSite_lf = 0;
var anz_onSite_dl = 0;
var anz_onSite_elw = 0;
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
var anz_Driving_elw = 0;
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

var aao_text = '';
var title = document.getElementById('missionH1');
var orig = title.innerHTML;
var keyword = orig;


setTimeout(function(){

    if (keyword.match('Krankentransport'))
        KTW(title, orig);
    else
        RTW(title, orig);

    checkOnSiteVehicles();
    checkDrivingVehicles();

    additionalFHZ();


    //Rettungsdienst-Einsätze für ein RTW hier eintragen
    if (keyword.match('Brandsicherheitswachdienst im Theater')) {
        alertFhz(rtw, 1, 'rtw');
    }

    //POL-Einsätze für 1 FuStW hier eintragen
    if (keyword.match('Ladendiebstahl') ||
        keyword.match('Taschendiebstahl') ||
        keyword.match('Metalldiebstahl') ||
        keyword.match('Person hinter Tür') ||
        keyword.match('Personalienaufnahme von Schwarzfahrer') ||
        keyword.match('Parkendes Auto gerammt') ||
        keyword.match('Notebook aus Schule entwendet') ||
        keyword.match('Einbruch in Keller') ||
        keyword.match('Einbruch in Wohnung') ||
        keyword.match('Sachbeschädigung') ||
        keyword.match('Ruhestörung') ||
        keyword.match('Angefahrene Person') ||
        keyword.match('Ampelausfall') ||
        keyword.match('Pannenfahrzeug') ||
        keyword.match('Hausfriedensbruch') ||
        keyword.match('Hilflose Person') ||
        keyword.match('Verkehrsbehinderung') ||
        keyword.match('Diebstahl aus Kfz') ||
        keyword.match('Fahrraddiebstahl') ||
        keyword.match('Wildunfall') ||
        keyword.match('Auffahrunfall') ||
        keyword.match('Trunkenheitsfahrt') ||
        keyword.match('Gasgeruch') ||
        keyword.match('Motorradunfall'))
    {
        alertFhz(fustw, 1, 'FuStW',false,'POL');
    }
    orig = title.innerHTML;

    //POL-Einsätze für 2 FuStW hier eintragen
    if (keyword.match('Rauchentwicklung im Museum'))
    {
        alertFhz(fustw, 2, 'FuStW',false,'POL');
    }
    orig = title.innerHTML;

    //Feuerwehr Einsätze für 1 LF hier eintragen
    if (keyword.match('Mülleimerbrand') ||
        keyword.match('Containerbrand') ||
        keyword.match('Brennender PKW') ||
        keyword.match('Motorrad-Brand') ||
        keyword.match('Brennendes Gras') ||
        keyword.match('Brennendes Laub') ||
        keyword.match('Fettbrand in Pommesbude') ||
        keyword.match('Sperrmüllbrand') ||
        keyword.match('Strohballen Brand') ||
        keyword.match('Traktor Brand') ||
        keyword.match('Brennende Telefonzelle') ||
        keyword.match('Kleiner Waldbrand') ||
        keyword.match('Brand in Briefkasten') ||
        keyword.match('Brennendes Gebüsch') ||
        keyword.match('Brennender Anhänger') ||
        keyword.match('Brennendes Bus-Häuschen') ||
        keyword.match('Brand auf Weihnachtsmarkt') ||
        keyword.match('Brennender Bollerwagen') ||
        keyword.match('Brennende Vogelscheuche') ||
        keyword.match('Brennende Papiercontainer') ||
        keyword.match('Brennende Hecke') ||
        keyword.match('Feuerprobealarm an Schule'))
    {
        alertFhz(lf, 1, 'LF', false, 'B');
    }
    if (keyword.match('Keller unter Wasser') ||
        keyword.match('Baum auf Straße') ||
        keyword.match('Baum auf PKW') ||
        keyword.match('Tiefgarage unter Wasser') ||
        keyword.match('Auffahrunfall') ||
        keyword.match('Baum auf Straße') ||
        keyword.match('Auslaufende Betriebsstoffe') ||
        keyword.match('Äste auf Fahrbahn') ||
        keyword.match('Umherfliegendes Baumaterial') ||
        keyword.match('Baum auf Radweg') ||
        keyword.match('Kleine Ölspur') ||
        keyword.match('Kleintier in Not') ||
        keyword.match('Verkehrsunfall') ||
        keyword.match('Motorradunfall'))
    {
        alertFhz(lf, 1, 'LF', false, 'THL');
    }
    orig = title.innerHTML;

    //Feuerwehr Einsätze für 2 LF hier eintragen
    if (keyword.match('Gartenlaubenbrand') ||
        keyword.match('Brennender LKW') ||
        keyword.match('Wohnwagenbrand') ||
        keyword.match('Kleiner Feldbrand') ||
        keyword.match('Feuer auf Balkon') ||
        keyword.match('Flächenbrand') ||
        keyword.match('Küchenbrand') ||
        keyword.match('Garagenbrand') ||
        keyword.match('Brennende Trafostation') ||
        keyword.match('Zimmerbrand') ||
        keyword.match('Schornsteinbrand'))
    {
        alertFhz(lf, 2, 'LF', false, 'B');
    }
    orig = title.innerHTML;

    //Feuerwehr Einsätze für 3 LF hier eintragen
    if (keyword.match('Dachstuhlbrand') ||
        keyword.match('Feuer in Schnellrestaurant') ||
        keyword.match('Kellerbrand') ||
        keyword.match('Brand im Supermarkt') ||
        keyword.match('Gasgeruch') ||
        keyword.match('Maschinenbrand') ||
        keyword.match('Feuer in Einfamilienhaus') ||
        keyword.match('Rauchentwicklung im Museum'))
    {
        alertFhz(lf, 3, 'LF', false, 'B');
    }
    orig = title.innerHTML;

    //Feuerwehr Einsätze für 4 LF hier eintragen
    if (keyword.match('Feuer im Krankenhaus'))
    {
        alertFhz(lf, 4, 'LF');
    }
    orig = title.innerHTML;

    //Feuerwehr Einsätze für 1 DL hier eintragen
    if (keyword.match('Dachstuhlbrand') ||
        keyword.match('Zimmerbrand') ||
        keyword.match('Schornsteinbrand') ||
        keyword.match('Brand im Supermarkt') ||
        keyword.match('Feuer in Einfamilienhaus') ||
        keyword.match('Rauchentwicklung im Museum') ||
        keyword.match('Feuer im Krankenhaus'))
    {
        alertFhz(dl, 1, 'DL');
    }
    orig = title.innerHTML;

    //Feuerwehr Einsätze für 1 RUEST hier eintragen
    if (keyword.match('Maschinenbrand'))
    {
        alertFhz(ruest, 1, 'RÜST');
    }
    orig = title.innerHTML;

    //Feuerwehr Einsätze für 2 RUEST hier eintragen
    if (keyword.match('Feuer im Krankenhaus'))
    {
        //RUEST(title, orig, 2);
    }
    orig = title.innerHTML;

    //Feuerwehr Einsätze für 1 ATEM hier eintragen
    if (keyword.match('Rauchentwicklung im Museum'))
    {
        alertFhz(atem, 1, 'ATEM');
    }
    orig = title.innerHTML;


    var h1 = document.getElementById('missionH1');
    var einsatzdate = h1.getAttribute("data-original-title");
    h1.insertAdjacentHTML('beforeend', '<br><small>'+einsatzdate+' - Vor <span id="einsatzdate"></span></small>');
    //var bar = document.getElementsByClassName('progress');
    //bar[0].insertAdjacentHTML('beforebegin', aao_text);
    title.insertAdjacentHTML('afterbegin', aao_text);
    display_ct(einsatzdate);

    var fhz_selected = document.getElementsByClassName('badge vehicle_amount_selected');
    if (fhz_selected.length > 0) {
        fhz_selected[0].innerHTML = fhz_selected[0].innerHTML + '/'+anzahl_fhz;
    }
    anzahl_fhz = 0;
    title.scrollIntoView();
    if (document.getElementById('amount_of_people') !== null)
        document.getElementById('amount_of_people').scrollIntoView();

    //Feuerwehr Einsätze für 1 ELW1 hier eintragen
    /*if (keyword.match('Brand im Supermarkt') ||
        keyword.match('Schornsteinbrand') ||
        keyword.match('Dachstuhlbrand') ||
        keyword.match('Kellerbrand') ||
        keyword.match('Feuer in Einfamilienhaus') ||
        keyword.match('Brennende Trafostation') ||
        keyword.match('Gasgeruch') ||
        keyword.match('Maschinenbrand') ||
        keyword.match('Rauchentwicklung im Museum') ||
        keyword.match('Feuer im Krankenhaus') ||
        keyword.match('Gasgeruch') ||
        keyword.match('Gasgeruch'))
    {
        ELW1(title, orig, 1);
    }*/


}, timeout);

function checkOnSiteVehicles() {
    var matches = [];
    var searchEles = document.querySelectorAll("#mission_vehicle_at_mission > tbody > tr > td > a");
    for(var i = 0; i < searchEles.length; i++) {
        var found = false;
        var fhz_id = searchEles[i].getAttribute('vehicle_type_id');
        if (fhz_id !== null) {

            for (var j=0;j<lf.length;j++) {
                if (fhz_id == lf[j]) {
                    anz_onSite_lf++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<dl.length;j++) {
                if (fhz_id == dl[j]) {
                    anz_onSite_dl++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<elw1.length;j++) {
                if (fhz_id == elw1[j]) {
                    anz_onSite_elw1++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<elw2.length;j++) {
                if (fhz_id == elw2[j]) {
                    anz_onSite_elw2++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<atem.length;j++) {
                if (fhz_id == atem[j]) {
                    anz_onSite_atem++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<ruest.length;j++) {
                if (fhz_id == ruest[j]) {
                    anz_onSite_ruest++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<oel.length;j++) {
                if (fhz_id == oel[j]) {
                    anz_onSite_oel++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<dekonp.length;j++) {
                if (fhz_id == dekonp[j]) {
                    anz_onSite_dekonp++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<gwg.length;j++) {
                if (fhz_id == gwg[j]) {
                    anz_onSite_gwg++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<gwm.length;j++) {
                if (fhz_id == gwm[j]) {
                    anz_onSite_gwm++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<gws.length;j++) {
                if (fhz_id == gws[j]) {
                    anz_onSite_gws++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<gwh.length;j++) {
                if (fhz_id == gwh[j]) {
                    anz_onSite_gwh++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<mtw.length;j++) {
                if (fhz_id == mtw[j]) {
                    anz_onSite_mtw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<fwk.length;j++) {
                if (fhz_id == fwk[j]) {
                    anz_onSite_fwk++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<rtw.length;j++) {
                if (fhz_id == rtw[j]) {
                    anz_onSite_rtw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<ktw.length;j++) {
                if (fhz_id == ktw[j]) {
                    anz_onSite_ktw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<nef.length;j++) {
                if (fhz_id == nef[j]) {
                    anz_onSite_nef++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<kdoworgl.length;j++) {
                if (fhz_id == kdoworgl[j]) {
                    anz_onSite_kdoworgl++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<kdowlna.length;j++) {
                if (fhz_id == kdowlna[j]) {
                    anz_onSite_kdowlna++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<fustw.length;j++) {
                if (fhz_id == fustw[j]) {
                    anz_onSite_fustw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<lebefkw.length;j++) {
                if (fhz_id == lebefkw[j]) {
                    anz_onSite_lebefkw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<grukw.length;j++) {
                if (fhz_id == grukw[j]) {
                    anz_onSite_grukw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<gefkw.length;j++) {
                if (fhz_id == gefkw[j]) {
                    anz_onSite_gefkw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<ph.length;j++) {
                if (fhz_id == ph[j]) {
                    anz_onSite_ph++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<kuekw.length;j++) {
                if (fhz_id == kuekw[j]) {
                    anz_onSite_kuekw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<gkw.length;j++) {
                if (fhz_id == gkw[j]) {
                    anz_onSite_gkw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<mzkw.length;j++) {
                if (fhz_id == mzkw[j]) {
                    anz_onSite_mzkw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<mtwtz.length;j++) {
                if (fhz_id == mtwtz[j]) {
                    anz_onSite_mtwtz++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<lkwk9.length;j++) {
                if (fhz_id == lkwk9[j]) {
                    anz_onSite_lkwk9++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<brmgr.length;j++) {
                if (fhz_id == brmgr[j]) {
                    anz_onSite_brmgr++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<anhdle.length;j++) {
                if (fhz_id == anhdle[j]) {
                    anz_onSite_anhdle++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<mlw5.length;j++) {
                if (fhz_id == mlw5[j]) {
                    anz_onSite_mlw5++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<gwsan.length;j++) {
                if (fhz_id == gwsan[j]) {
                    anz_onSite_gwsan++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<elw1seg.length;j++) {
                if (fhz_id == fwelw1segk[j]) {
                    anz_onSite_elw1seg++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

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
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<dl.length;j++) {
                if (fhz_id == dl[j]) {
                    anz_Driving_dl++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<elw1.length;j++) {
                if (fhz_id == elw1[j]) {
                    anz_Driving_elw1++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<elw2.length;j++) {
                if (fhz_id == elw2[j]) {
                    anz_Driving_elw2++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<atem.length;j++) {
                if (fhz_id == atem[j]) {
                    anz_Driving_atem++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<ruest.length;j++) {
                if (fhz_id == ruest[j]) {
                    anz_Driving_ruest++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<oel.length;j++) {
                if (fhz_id == oel[j]) {
                    anz_Driving_oel++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<dekonp.length;j++) {
                if (fhz_id == dekonp[j]) {
                    anz_Driving_dekonp++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<gwg.length;j++) {
                if (fhz_id == gwg[j]) {
                    anz_Driving_gwg++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<gwm.length;j++) {
                if (fhz_id == gwm[j]) {
                    anz_Driving_gwm++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<gws.length;j++) {
                if (fhz_id == gws[j]) {
                    anz_Driving_gws++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<gwh.length;j++) {
                if (fhz_id == gwh[j]) {
                    anz_Driving_gwh++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<mtw.length;j++) {
                if (fhz_id == mtw[j]) {
                    anz_Driving_mtw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<fwk.length;j++) {
                if (fhz_id == fwk[j]) {
                    anz_Driving_fwk++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<rtw.length;j++) {
                if (fhz_id == rtw[j]) {
                    anz_Driving_rtw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<ktw.length;j++) {
                if (fhz_id == ktw[j]) {
                    anz_Driving_ktw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<nef.length;j++) {
                if (fhz_id == nef[j]) {
                    anz_Driving_nef++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<kdoworgl.length;j++) {
                if (fhz_id == kdoworgl[j]) {
                    anz_Driving_kdoworgl++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<kdowlna.length;j++) {
                if (fhz_id == kdowlna[j]) {
                    anz_Driving_kdowlna++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<fustw.length;j++) {
                if (fhz_id == fustw[j]) {
                    anz_Driving_fustw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<lebefkw.length;j++) {
                if (fhz_id == lebefkw[j]) {
                    anz_Driving_lebefkw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<grukw.length;j++) {
                if (fhz_id == grukw[j]) {
                    anz_Driving_grukw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<gefkw.length;j++) {
                if (fhz_id == gefkw[j]) {
                    anz_Driving_gefkw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<ph.length;j++) {
                if (fhz_id == ph[j]) {
                    anz_Driving_ph++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<kuekw.length;j++) {
                if (fhz_id == kuekw[j]) {
                    anz_Driving_kuekw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<gkw.length;j++) {
                if (fhz_id == gkw[j]) {
                    anz_Driving_gkw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<mzkw.length;j++) {
                if (fhz_id == mzkw[j]) {
                    anz_Driving_mzkw++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<mtwtz.length;j++) {
                if (fhz_id == mtwtz[j]) {
                    anz_Driving_mtwtz++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<lkwk9.length;j++) {
                if (fhz_id == lkwk9[j]) {
                    anz_Driving_lkwk9++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<brmgr.length;j++) {
                if (fhz_id == brmgr[j]) {
                    anz_Driving_brmgr++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<anhdle.length;j++) {
                if (fhz_id == anhdle[j]) {
                    anz_Driving_anhdle++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<mlw5.length;j++) {
                if (fhz_id == mlw5[j]) {
                    anz_Driving_mlw5++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<gwsan.length;j++) {
                if (fhz_id == gwsan[j]) {
                    anz_Driving_gwsan++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

            for (j=0;j<elw1seg.length;j++) {
                if (fhz_id == fwelw1segk[j]) {
                    anz_Driving_elw1seg++;
                    found=true;
                    break;
                }
            }
            if (found)
                break;

        }
    }

}

function alertFhz(fhz, anzahl, desc, additional, aao_key) {
    var color;
    if (additional !== true)
        additional=false;

    var checked = 0;
    var anzahl_orig = anzahl;
    if (aao_key === null || typeof aao_key === 'undefined')
        aao_key = '';

    switch(desc.toLowerCase()) {
        case "lf":
        case "dl":
        case "elw1":
        case "elw2":
        case "atem":
        case "rüst":
        case "öl":
        case "dekon-p":
        case "gw-g":
        case "gw-m":
        case "gw-s":
        case "gw-h":
        case "mtw":
        case "fwk":
            color = color_fw;
            break;
        case "rtw":
        case "ktw":
        case "nef":
        case "kdow-orgl":
        case "kdow-lna":
            color = color_rd;
            break;
        case "fustw":
        case "lebefkw":
        case "grukw":
        case "gefkw":
        case "ph":
        case "kuekw":
            color = color_pol;
            break;
        case "gkw":
        case "mzkw":
        case "mtw-tz":
        case "lkw-k9":
        case "brmgr":
        case "anhdle":
        case "mlw5":
            color = color_thw;
            break;
        case "gw-san":
        case "elw1-seg":
            color = color_seg;
            break;
    }

    //if (!additional) {
        switch(desc.toLowerCase()) {
            case "lf":
                anzahl = anzahl - (anz_onSite_lf + anz_Driving_lf);
                break;
            case "dl":
                anzahl = anzahl - (anz_onSite_dl + anz_Driving_dl);
                break;
            case "elw1":
                anzahl = anzahl - (anz_onSite_elw1 + anz_Driving_elw1);
                break;
            case "elw2":
                anzahl = anzahl - (anz_onSite_elw2 + anz_Driving_elw2);
                break;
            case "atem":
                anzahl = anzahl - (anz_onSite_atem + anz_Driving_atem);
                break;
            case "rüst":
                anzahl = anzahl - (anz_onSite_ruest + anz_Driving_ruest);
                break;
            case "öl":
                anzahl = anzahl - (anz_onSite_oel + anz_Driving_oel);
                break;
            case "dekon-p":
                anzahl = anzahl - (anz_onSite_dekonp + anz_Driving_dekonp);
                break;
            case "gw-g":
                anzahl = anzahl - (anz_onSite_gwg + anz_Driving_gwg);
                break;
            case "gw-m":
                anzahl = anzahl - (anz_onSite_gwm + anz_Driving_gwm);
                break;
            case "gw-s":
                anzahl = anzahl - (anz_onSite_gws + anz_Driving_gws);
                break;
            case "gw-h":
                anzahl = anzahl - (anz_onSite_gwh + anz_Driving_gwh);
                break;
            case "mtw":
                anzahl = anzahl - (anz_onSite_mtw + anz_Driving_mtw);
                break;
            case "fwk":
                anzahl = anzahl - (anz_onSite_fwk + anz_Driving_fwk);
                break;
            case "rtw":
                anzahl = anzahl - (anz_onSite_rtw + anz_Driving_rtw);
                break;
            case "ktw":
                anzahl = anzahl - (anz_onSite_ktw + anz_Driving_ktw);
                break;
            case "nef":
                anzahl = anzahl - (anz_onSite_nef + anz_Driving_nef);
                break;
            case "kdow-orgl":
                anzahl = anzahl - (anz_onSite_kdoworgl + anz_Driving_kdoworgl);
                break;
            case "kdow-lna":
                anzahl = anzahl - (anz_onSite_kdowlna + anz_Driving_kdowlna);
                break;
            case "fustw":
                anzahl = anzahl - (anz_onSite_fustw + anz_Driving_fustw);
                break;
            case "lebefkw":
                anzahl = anzahl - (anz_onSite_lebefkw + anz_Driving_lebefkw);
                break;
            case "grukw":
                anzahl = anzahl - (anz_onSite_grukw + anz_Driving_grukw);
                break;
            case "gefkw":
                anzahl = anzahl - (anz_onSite_gefkw + anz_Driving_gefkw);
                break;
            case "ph":
                anzahl = anzahl - (anz_onSite_ph + anz_Driving_ph);
                break;
            case "kuekw":
                anzahl = anzahl - (anz_onSite_kuekw + anz_Driving_kuekw);
                break;
            case "gkw":
                anzahl = anzahl - (anz_onSite_gkw + anz_Driving_gkw);
                break;
            case "mzkw":
                anzahl = anzahl - (anz_onSite_mzkw + anz_Driving_mzkw);
                break;
            case "mtw-tz":
                anzahl = anzahl - (anz_onSite_mtwtz + anz_Driving_mtwtz);
                break;
            case "lkw-k9":
                anzahl = anzahl - (anz_onSite_lkwk9 + anz_Driving_lkwk9);
                break;
            case "brmgr":
                anzahl = anzahl - (anz_onSite_brmgr + anz_Driving_brmgr);
                break;
            case "anhdle":
                anzahl = anzahl - (anz_onSite_anhdle + anz_Driving_anhdle);
                break;
            case "mlw5":
                anzahl = anzahl - (anz_onSite_mlw5 + anz_Driving_mlw5);
                break;
            case "gw-san":
                anzahl = anzahl - (anz_onSite_gwsan + anz_Driving_gwsan);
                break;
            case "elw1-seg":
                anzahl = anzahl - (anz_onSite_elw1seg + anz_Driving_elw1seg);
                break;
        }
    //}

    if(veh_driving === null && veh_mission === null || additional) {
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
                        if (y == fhz[j] && checked < anzahl) {
                            //click the vehicle
                            var fahrzeug = x[i].children[0];
                            fahrzeug.click();
                            //and count how many are clicked
                            checked++;
                        }
                    }
                }
            }
        }
    }
    if (checked < anzahl) {
        missingFhzText = missingFhzText + ', '+(anzahl-checked)+' '+desc;
    }
    anzahl_fhz = anzahl_fhz + checked;
    checked = 0;

    if (anzahl_orig > 0 && !additional && aao_key !== '')
        aao_text = '<font color='+color+'><b> '+aao_key+''+anzahl_orig+'</b></font>'+aao_text;
}

function RTW(el, orig) {
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
        alertFhz(rtw, patients_anzahl, 'RTW',false,'RD');
    }
}

function KTW(el, orig) {
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
        alertFhz(ktw, anzahl, 'KTW',false,'RD');
    }
}

function additionalFHZ() {
    var additionalfhz = document.getElementsByClassName('alert alert-danger');
    var count_rtw = 0;
    var count_nef = 0;
    for (var i = 0;i<additionalfhz.length;i++) {
        if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Zusätzlich benötigte Fahrzeuge:')>=0) {
            var additionalfhzInnerText = additionalfhz[i].innerText.replace(/\s\([a-zA-Z\s0-9]*\)/ig,'').replace('Zusätzlich benötigte Fahrzeuge: ','').replace(',','');
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
                    }
                }
            }
        }
        if (additionalfhz.length > 0 && additionalfhz[i].innerText.search('Wir benötigen einen RTW.')>=0 && (veh_driving !== null || veh_mission !== null)) {
            count_rtw++;
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
    if (count_rtw > 0)
        alertFhz(rtw, count_rtw, 'RTW', true);
    if (count_nef > 0)
        alertFhz(nef, count_nef, 'NEF', true);
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
    document.getElementById('einsatzdate').innerHTML = newHour + newMin + ' min';
}
