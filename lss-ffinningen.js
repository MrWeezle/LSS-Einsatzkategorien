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


    if (veh_driving !== null || veh_mission !== null) {
        additionalFHZ();
    }

    //RTW und KTW Einsätze hier eintragen
    if (keyword.match('Krankentransport'))
        KTW(elems[i], orig);
    else
        RTW(elems[i], orig);
    orig = elems[i].innerHTML;


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
        keyword.match('Gasgeruch'))
    {
        POL(elems[i], orig, 1);
    }
    orig = elems[i].innerHTML;

    //POL-Einsätze für 2 FuStW hier eintragen
    if (keyword.match('Rauchentwicklung im Museum') ||
        keyword.match('Feuer im Krankenhaus'))
    {
        POL(elems[i], orig, 2);
    }
    orig = elems[i].innerHTML;

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
        keyword.match('Auffahrunfall'))
    {
        LF(elems[i], orig, 1);
    }
    orig = elems[i].innerHTML;

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
        LF(elems[i], orig, 2);
    }
    orig = elems[i].innerHTML;

    //Feuerwehr Einsätze für 3 LF hier eintragen
    if (keyword.match('Feuer in Schnellrestaurant') ||
        keyword.match('Kellerbrand') ||
        keyword.match('Brand im Supermarkt') ||
        keyword.match('Gasgeruch') ||
        keyword.match('Maschinenbrand') ||
        keyword.match('Feuer in Einfamilienhaus') ||
        keyword.match('Rauchentwicklung im Museum'))
    {
        LF(elems[i], orig, 3);
    }
    orig = elems[i].innerHTML;

    //Feuerwehr Einsätze für 4 LF hier eintragen
    if (keyword.match('Feuer im Krankenhaus'))
    {
        LF(elems[i], orig, 4);
    }
    orig = elems[i].innerHTML;

    //Feuerwehr Einsätze für 1 DL hier eintragen
    if (keyword.match('Dachstuhlbrand') ||
        keyword.match('Zimmerbrand') ||
        keyword.match('Schornsteinbrand') ||
        keyword.match('Brand im Supermarkt') ||
        keyword.match('Feuer in Einfamilienhaus') ||
        keyword.match('Rauchentwicklung im Museum') ||
        keyword.match('Feuer im Krankenhaus'))
    {
        DL(elems[i], orig, 1);
    }
    orig = elems[i].innerHTML;

    //Feuerwehr Einsätze für 1 RUEST hier eintragen
    if (keyword.match('Maschinenbrand') ||
        keyword.match('Brand im Supermarkt'))
    {
        RUEST(elems[i], orig, 1);
    }
    orig = elems[i].innerHTML;

    //Feuerwehr Einsätze für 2 RUEST hier eintragen
    if (keyword.match('Feuer im Krankenhaus'))
    {
        RUEST(elems[i], orig, 2);
    }
    orig = elems[i].innerHTML;

    //Feuerwehr Einsätze für 1 ATEM hier eintragen
    if (keyword.match('Maschinenbrand') ||
        keyword.match('Rauchentwicklung im Museum'))
    {
        ATEM(elems[i], orig, 1);
    }
    orig = elems[i].innerHTML;

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
        ELW1(elems[i], orig, 1);
    }
    orig = elems[i].innerHTML;*/


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
        checkAlertedFhz(KTW_AAO, anzahl.length);
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

function POL(el, orig, anzahl) {
    if (anzahl<1)
        anzahl = 1;

    if (anzahl > 0) {
        checkAlertedFhz(POL_AAO, anzahl);
        el.innerHTML = '<font color='+color_pol+'><b>'+anzahl+'POL </b></font>'+orig;
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

    if (additionalfhz.length > 0 && additionalfhz[0].innerText.search('Zusätzlich benötigte Fahrzeuge:')>=0 && veh_driving === null) {
        var additionalfhzInnerText = additionalfhz[0].innerText.replace(/\s\([a-zA-Z\s0-9]*\)/ig,'').replace('Zusätzlich benötigte Fahrzeuge: ','');

        var fhz = additionalfhzInnerText.split(' ');
        for (var ab=0;ab<fhz.length;ab++) {
            if((ab % 2) === 0) {
                var j;
                switch(fhz[ab+1]) {
                    case "Drehleitern":
                        for (j=0;j<fhz[ab];j++) {
                            document.getElementById(DL_AAO).click();
                        }
                        break;
                    case "Löschfahrzeug":
                        for (j=0;j<fhz[ab];j++) {
                            document.getElementById(LF_AAO).click();
                        }
                        break;

                    case "Löschfahrzeuge":
                        for (j=0;j<fhz[ab];j++) {
                            document.getElementById(LF_AAO).click();
                        }
                        break;

                    case "Rüstwagen":
                        for (j=0;j<fhz[ab];j++) {
                            document.getElementById(RUEST_AAO).click();
                        }
                        break;
                    case "FuStW":
                        for (j=0;j<fhz[ab];j++) {
                            document.getElementById(POL_AAO).click();
                        }
                        break;
                }
            }
        }
    }
    else {
        var sprechwunsch = document.getElementsByClassName('btn btn-xs btn-success');

        if (sprechwunsch.length>0 && sprechwunsch[0].innerText.search('Ein Fahrzeug hat einen Sprechwunsch!'))
            sprechwunsch[0].click();
    }
}
