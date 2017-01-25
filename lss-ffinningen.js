// ==UserScript==
// @name        Einsatzkategorien
// @namespace   Leitstellenspiel
// @include     http*://www.leitstellenspiel.de/*
// @version     dev
// @author      FFInningen
// @grant       none
// @run-at      document-idle
// ==/UserScript==

var color_fw       = 'red';
var color_thw      = 'blue';
var color_pol      = 'green';
var color_rd       = 'pink';
var color_wasser   = 'blue';

//Feuerwehr-Fahrzeug-AAO - pro AAO nur ein Fahrzeug!!!
var DL_AAO         = 'aao_1025461';
var ELW1_AAO       = 'aao_1025469';
var ELW2_AAO       = 'aao_1030713';
var LF_AAO         = 'aao_1025454';

var ATEM_AAO       = 'aao_1030717';
var OEL_AAO        = 'aao_1030716';
var SCHLAUCH_AAO   = 'aao_1030718';
var KRAN_AAO       = 'aao_1030721';
var RUEST_AAO      = 'aao_1025472';
var DEKONP_AAO     = 'aao_1030720';
var GWG_AAO        = 'aao_1030715';
var GWH_AAO        = 'aao_1030719';
var GWM_AAO        = 'aao_1030714';

//Rettungsdienst-Fahrzeug-AAO - pro AAO nur ein Fahrzeug!!!
var KTW_AAO        = 'aao_1030722';
var RTW_AAO        = 'aao_1030515';
var NEF_AAO        = 'aao_1030723';
var RTH_AAO        = 'aao_1030724';
var LNA_AAO        = 'aao_1030725';
var ORGL_AAO       = 'aao_1030726';

//Polizei-Fahrzeug-AAO - pro AAO nur ein Fahrzeug!!!
var POL_AAO        = 'aao_1030727';


/************************************************************************
*                                                                       *
*                     AB HIER NICHTS MEHR ÄNDERN!!!                     *
*                                                                       *
************************************************************************/

var veh_driving = document.getElementById('mission_vehicle_driving');
var veh_mission = document.getElementById('mission_vehicle_at_mission');

//.replace('Zusätzlich benötigte Fahrzeuge: ','')

//alert(additionalfhzInnerText);

var elems = document.querySelectorAll('h3#missionH1');

for (var i = 0, len = elems.length; i < len; i++){
    var keyword;
    var orig = elems[i].innerHTML;
    elems[i].innerHTML = elems[i].innerHTML.replace(/(<small>[^.]+<\/small>)/ig, '');
    keyword = elems[i].innerText;

    RTW(elems[i], orig);
    orig = elems[i].innerHTML;

    if (veh_driving !== null || veh_mission !== null) {
        additionalFHZ();
    }
    switch(keyword) {
        case (keyword.match('Mülleimerbrand') ||
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
              keyword.match('Baum auf Straße') ||
              keyword.match('Kleiner Waldbrand') ||
              keyword.match('Brand in Briefkasten') ||
              keyword.match('Brennendes Gebüsch') ||
              keyword.match('Brennender Anhänger') ||
              keyword.match('Brennendes Bus-Häuschen') ||
              keyword.match('Verkehrsunfall') ||
              keyword.match('Auslaufende Betriebsstoffe') ||
              keyword.match('Brand auf Weihnachtsmarkt') ||
              keyword.match('Kleintier in Not') ||
              keyword.match('Brennender Bollerwagen') ||
              keyword.match('Kleine Ölspur') ||
              keyword.match('Brennende Vogelscheuche') ||
              keyword.match('Brennende Papiercontainer') ||
              keyword.match('Brennende Hecke') ||
              keyword.match('Äste auf Fahrbahn') ||
              keyword.match('Umherfliegendes Baumaterial') ||
              keyword.match('Baum auf Radweg') ||
              keyword.match('Feuerprobealarm an Schule') ||
              keyword.match('Keller unter Wasser') ||
              keyword.match('Baum auf Straße') ||
              keyword.match('Baum auf PKW') ||
              keyword.match('Tiefgarage unter Wasser') ||
              {}).input:

            LF(elems[i], orig, 1);
            break;

        case (keyword.match('Gartenlaubenbrand') ||
              keyword.match('Brennender LKW') ||
              keyword.match('Wohnwagenbrand') ||
              keyword.match('Kleiner Feldbrand') ||
              keyword.match('Feuer auf Balkon') ||
              keyword.match('Flächenbrand') ||
              keyword.match('Küchenbrand') ||
              keyword.match('Garagenbrand') ||
              keyword.match('Brennende Trafostation') ||
              {}).input:

            LF(elems[i], orig, 2);
            break;

        case (keyword.match('Zimmerbrand') ||
              keyword.match('Schornsteinbrand') ||
              {}).input:

            DL(elems[i], orig, 1);
            orig = elems[i].innerHTML;
            LF(elems[i], orig, 2);
            break;

        case (keyword.match('Feuer in Schnellrestaurant') ||
              keyword.match('Kellerbrand') ||
              {}).input:

            LF(elems[i], orig, 3);
            break;

        case (keyword.match('Dachstuhlbrand') ||
              keyword.match('Feuer in Einfamilienhaus') ||
              {}).input:

            DL(elems[i], orig, 1);
            orig = elems[i].innerHTML;
            LF(elems[i], orig, 3);
            break;

        case (keyword.match('Brand im Supermarkt') ||
              {}).input:

            RUEST(elems[i], orig, 1);
            orig = elems[i].innerHTML;
            DL(elems[i], orig, 1);
            orig = elems[i].innerHTML;
            LF(elems[i], orig, 3);
            break;
    }
}

function DL(el, orig, anzahl) {
    if (anzahl<1)
        anzahl = 1;

    checkAlertedFhz(DL_AAO, anzahl);

    el.innerHTML = '<font color='+color_fw+'><b>'+anzahl+'DL </b></font>'+orig;
}

function ELW1(el, orig, anzahl) {

    if (anzahl<1)
        anzahl = 1;

    checkAlertedFhz(ELW1_AAO, anzahl);

    el.innerHTML = '<font color='+color_fw+'><b>'+anzahl+'ELW1 </b></font>'+orig;
}

function ELW2(el, orig, anzahl) {

    if (anzahl<1)
        anzahl = 1;

    checkAlertedFhz(ELW2_AAO, anzahl);

    el.innerHTML = '<font color='+color_fw+'><b>'+anzahl+'ELW2 </b></font>'+orig;
}

function LF(el, orig, anzahl) {

    if (anzahl<1)
        anzahl = 1;

    checkAlertedFhz(LF_AAO, anzahl);
    el.innerHTML = '<font color='+color_fw+'><b>'+anzahl+'LF </b></font>'+orig;
}

function ATEM(el, orig, anzahl) {

    if (anzahl<1)
        anzahl = 1;

    checkAlertedFhz(ATEM_AAO, anzahl);

    el.innerHTML = '<font color='+color_fw+'><b>'+anzahl+'ATEM </b></font>'+orig;
}

function OEL(el, orig, anzahl) {

    if (anzahl<1)
        anzahl = 1;

    checkAlertedFhz(OEL_AAO, anzahl);

    el.innerHTML = '<font color='+color_fw+'><b>'+anzahl+'ÖL </b></font>'+orig;
}

function SCHLAUCH(el, orig, anzahl) {

    if (anzahl<1)
        anzahl = 1;

    checkAlertedFhz(SCHLAUCH_AAO, anzahl);

    el.innerHTML = '<font color='+color_fw+'><b>'+anzahl+'SCHLAUCH </b></font>'+orig;
}

function KRAN(el, orig, anzahl) {

    if (anzahl<1)
        anzahl = 1;

    checkAlertedFhz(KRAN_AAO, anzahl);

    el.innerHTML = '<font color='+color_fw+'><b>'+anzahl+'KRAN </b></font>'+orig;
}

function RUEST(el, orig, anzahl) {
    if (anzahl<1)
        anzahl = 1;

    checkAlertedFhz(RUEST_AAO, anzahl);

    el.innerHTML = '<font color='+color_fw+'><b>'+anzahl+'RÜST </b></font>'+orig;
}

function DEKONP(el, orig, anzahl) {
    if (anzahl<1)
        anzahl = 1;

    checkAlertedFhz(DEKONP_AAO, anzahl);

    el.innerHTML = '<font color='+color_fw+'><b>'+anzahl+'DEKON-P </b></font>'+orig;
}

function GWG(el, orig, anzahl) {
    if (anzahl<1)
        anzahl = 1;

    checkAlertedFhz(GWG_AAO, anzahl);

    el.innerHTML = '<font color='+color_fw+'><b>'+anzahl+'GW-G </b></font>'+orig;
}

function GWH(el, orig, anzahl) {
    if (anzahl<1)
        anzahl = 1;

    checkAlertedFhz(GWH_AAO, anzahl);

    el.innerHTML = '<font color='+color_fw+'><b>'+anzahl+'GW-H </b></font>'+orig;
}

function GWM(el, orig, anzahl) {
    if (anzahl<1)
        anzahl = 1;

    checkAlertedFhz(GWM_AAO, anzahl);

    el.innerHTML = '<font color='+color_fw+'><b>'+anzahl+'GW-M </b></font>'+orig;
}

function KTW(el, orig) {

    var anzahl = document.getElementsByClassName("patient_progress");

    if (anzahl.length > 0) {
        checkAlertedFhz(RTW_AAO, anzahl.length);
        el.innerHTML = '<font color='+color_rd+'><b>'+anzahl.length+'KTW </b></font>'+orig;
    }
}

function RTW(el, orig) {

    var anzahl = document.getElementsByClassName("patient_progress");

    if (anzahl.length > 0) {
        checkAlertedFhz(RTW_AAO, anzahl.length);
        el.innerHTML = '<font color='+color_rd+'><b>'+anzahl.length+'RTW </b></font>'+orig;
    }
}

function NEF(el, orig) {

    var anzahl = document.getElementsByClassName("patient_progress");

    if (anzahl.length > 0) {
        checkAlertedFhz(RTW_AAO, anzahl.length);
        el.innerHTML = '<font color='+color_rd+'><b>'+anzahl.length+'NEF </b></font>'+orig;
    }
}

function RTH(el, orig) {

    var anzahl = document.getElementsByClassName("patient_progress");

    if (anzahl.length > 0) {
        checkAlertedFhz(RTW_AAO, anzahl.length);
        el.innerHTML = '<font color='+color_rd+'><b>'+anzahl.length+'RTH </b></font>'+orig;
    }
}

function LNA(el, orig) {

    var anzahl = document.getElementsByClassName("patient_progress");

    if (anzahl.length > 0) {
        checkAlertedFhz(RTW_AAO, anzahl.length);
        el.innerHTML = '<font color='+color_rd+'><b>'+anzahl.length+'LNA </b></font>'+orig;
    }
}

function ORGL(el, orig) {

    var anzahl = document.getElementsByClassName("patient_progress");

    if (anzahl.length > 0) {
        checkAlertedFhz(RTW_AAO, anzahl.length);
        el.innerHTML = '<font color='+color_rd+'><b>'+anzahl.length+'ORGL </b></font>'+orig;
    }
}

function POL(el, orig) {

    var anzahl = document.getElementsByClassName("patient_progress");

    if (anzahl.length > 0) {
        checkAlertedFhz(RTW_AAO, anzahl.length);
        el.innerHTML = '<font color='+color_pol+'><b>'+anzahl.length+'POL </b></font>'+orig;
    }
}

function checkAlertedFhz(aao, anzahl) {
    if(veh_driving === null && veh_mission === null) {
        for (var i=0; i < anzahl;i++)
            document.getElementById(aao).click();
    }
}

function additionalFHZ() {
    var additionalfhz = document.getElementsByClassName('alert alert-danger');

    if (additionalfhz.length > 0 && additionalfhz[0].innerText.search('Zusätzlich benötigte Fahrzeuge:')>=0) {
        var additionalfhzInnerText = additionalfhz[0].innerText.replace(/\s\([a-zA-Z\s0-9]*\)/ig,'').replace('Zusätzlich benötigte Fahrzeuge: ','');

        var fhz = additionalfhzInnerText.split(' ');
        switch(fhz[1]) {
            case "Drehleitern":
                for (var j=0;j<fhz[0];j++) {
                    document.getElementById(DL_AAO).click();
                }
                break;
            case "Löschfahrzeug":
                for (var j=0;j<fhz[0];j++) {
                    document.getElementById(LF_AAO).click();
                }
                break;
            case "Löschfahrzeuge":
                for (var j=0;j<fhz[0];j++) {
                    document.getElementById(LF_AAO).click();
                }
                break;

            case "Rüstwagen":
                for (var j=0;j<fhz[0];j++) {
                    document.getElementById(RUEST_AAO).click();
                }
                break;
        }
    }
    else {
        var sprechwunsch = document.getElementsByClassName('btn btn-xs btn-success');

        if (sprechwunsch.length>0 && sprechwunsch[0].innerText.search('Ein Fahrzeug hat einen Sprechwunsch!'))
            sprechwunsch[0].click();
    }
}
